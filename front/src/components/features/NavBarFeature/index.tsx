import React, {useCallback, useMemo, useTransition} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useIntl} from "react-intl";
import {useConnectedUserInfo, useClientId, useRouteAccess, useRouteInfo} from "lys-front/providers";
import {generateUrlByRoute} from "lys-front/tools";
import {RouteInterface} from "lys-front/types";
import {NavBarFeatureProps} from "./types";
import {useNavBarFeatureTranslations} from "./translations";
import {useUserAccountDialog} from "./hooks/useUserAccountDialog.tsx";
import {useRouteNavigator} from "@/hooks/useRouteNavigator";
import {menuSections, MenuSection} from "@/services/navigation/menuSections";
import {NAVIGATION_TRANS_PREFIX} from "@/services/navigation";
import SelectClientRestricted from "@/components/restrictedFeatures/SelectClientRestricted";
import LinkRestricted from "@/components/restrictedFeatures/LinkRestricted";
import NotificationBellRestricted from "@/components/restrictedFeatures/NotificationBellRestricted";
import DropDownMenuElement from "@/components/elements/DropDownMenuElement";
import {DropDownMenu} from "@/components/elements/DropDownMenuElement/types";
import {useThemeContext} from "@/components/providers/ThemeProvider";
import "./styles.scss";

/**
 * NavBarFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Bootstrap Navbar with brand
 * - Left-side navigation from menuSections configuration (direct links + dropdown menus)
 * - User dropdown menu on the right
 * - Logout functionality via ConnectedUserProvider
 */
const NavBarFeature: React.FC<NavBarFeatureProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useNavBarFeatureTranslations();
    const intl = useIntl();
    const navigate = useNavigate();
    const [, startTransition] = useTransition();
    const {logout} = useConnectedUserInfo();
    const {open: openUserAccount} = useUserAccountDialog();
    const {clientId, setClientId, isLocked} = useClientId();
    const {route: currentRoute, allRoutes} = useRouteInfo();
    const hasRouteAccess = useRouteAccess();
    const {buildNavigateOnClick} = useRouteNavigator();
    const {theme, toggleTheme} = useThemeContext();

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle logout
     */
    const handleLogout = useCallback(() => {
        const [logoutFn] = logout;
        logoutFn();
    }, [logout]);

    /**
     * Navigate to a route via startTransition (same pattern as useRestrictedLink)
     */
    const navigateToRoute = useCallback((route: RouteInterface, queryParameters?: Record<string, string>) => {
        startTransition(() => { navigate(generateUrlByRoute(route, {}, queryParameters)); });
    }, [navigate, startTransition]);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Route names matching the current route — used to compute the active
     * state of collapsible-section items. Includes the current route plus
     * its declared `breadcrumbs` (in case the active route is reached via
     * a breadcrumb chain).
     */
    const activeRouteNames = useMemo(() => {
        if (!currentRoute) return [];
        return [currentRoute.name, ...(currentRoute.breadcrumbs || [])];
    }, [currentRoute]);

    /**
     * User dropdown menu configuration.
     *
     * The `administration` and `supervision` items use `buildNavigateOnClick`
     * so that each entry is automatically hidden (onClick=undefined) when the
     * user lacks access to the corresponding page's `mainWebserviceName`.
     */
    const userMenu: DropDownMenu[] = useMemo(() => [
        {
            account: {
                icon: <i className="bi bi-person-gear"></i>,
                label: t("myAccount"),
                onClick: openUserAccount,
            } as const,
            administration: {
                icon: <i className="bi bi-gear"></i>,
                label: t("administration"),
                onClick: buildNavigateOnClick("ClientAdminPage"),
            } as const,
            supervision: {
                icon: <i className="bi bi-eye"></i>,
                label: t("supervision"),
                onClick: buildNavigateOnClick("ListClientPage"),
            } as const,
        },
        {
            logout: {
                icon: <i className="bi bi-box-arrow-right"></i>,
                label: t("logout"),
                onClick: handleLogout,
                variant: "danger" as const,
            },
        },
    ] as DropDownMenu[], [t, handleLogout, openUserAccount, buildNavigateOnClick]);

    /*******************************************************************************************************************
     *                                                  RENDER HELPERS
     ******************************************************************************************************************/

    /**
     * Render a menu section as a navbar item.
     * Direct links become LinkRestricted nav items; collapsible sections
     * become a DropDownMenuElement with permission-filtered items.
     */
    const renderNavSection = (section: MenuSection) => {
        // Direct link section
        if ("link" in section) {
            const route = allRoutes[section.link.routeName];
            if (!route) return null;

            if (!hasRouteAccess(route)) {
                return null;
            }

            // Active when the current path falls under this section. Matches both
            // the section's own page (`/home`, `/admin`) and any nested tab path
            // (`/analysis/synthesis`, `/actions/kanban`, …) by checking the
            // `pathPrefix` (defaults to `/<section.id>`).
            const currentPath = currentRoute?.path ?? "";
            const prefix = section.pathPrefix ?? `/${section.id}`;
            const isActive = currentPath === prefix || currentPath.startsWith(`${prefix}/`);

            return (
                <LinkRestricted
                    key={section.id}
                    route={route}
                    queryParameters={section.link.queryParameters}
                    className={`nav-link ${isActive ? "active" : ""}`}
                >
                    <i className={`${section.icon} me-1`} />
                    {intl.formatMessage({id: NAVIGATION_TRANS_PREFIX + section.labelKey})}
                </LinkRestricted>
            );
        }

        // Collapsible section: build DropDownMenu from accessible links
        const menuItems: DropDownMenu = {};

        section.links
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .forEach(link => {
                const route = allRoutes[link.routeName];
                if (!route) return;
                if (!hasRouteAccess(route)) return;

                menuItems[link.routeName] = {
                    icon: link.icon ? <i className={link.icon} /> : undefined,
                    label: intl.formatMessage({id: NAVIGATION_TRANS_PREFIX + link.labelKey}),
                    onClick: () => navigateToRoute(route, link.queryParameters),
                    active: activeRouteNames.includes(link.routeName),
                };
            });

        // Hide section if no accessible links
        if (Object.keys(menuItems).length === 0) {
            return null;
        }

        const isSectionActive = section.links.some(link =>
            activeRouteNames.includes(link.routeName)
        );

        return (
            <DropDownMenuElement
                key={section.id}
                menus={[menuItems]}
                variant="link"
                align="start"
                className={`nav-section-dropdown ${isSectionActive ? "active" : ""}`}
                toggleContent={
                    <>
                        <i className={`${section.icon} me-1`} />
                        {intl.formatMessage({id: NAVIGATION_TRANS_PREFIX + section.labelKey})}
                    </>
                }
            />
        );
    };

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <Navbar expand="lg" className="navbar-feature">
            <Container fluid>
                {/* Brand */}
                <Navbar.Brand>
                    <span className="navbar-brand-text">Lys App</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />

                <Navbar.Collapse id="navbar-nav">
                    {/* Left-side navigation from menu configuration */}
                    <Nav className="me-auto">
                        {menuSections
                            .sort((a, b) => a.order - b.order)
                            .map(renderNavSection)}
                    </Nav>

                    {/* Right-side user menu */}
                    <Nav className="align-items-center gap-2">
                        {!isLocked && (
                            <SelectClientRestricted
                                id="navbar-client-select"
                                value={clientId || ""}
                                onChange={(e) => setClientId(e.target.value || null)}
                                hideLabel
                                size="sm"
                                nullable
                            />
                        )}
                        <NotificationBellRestricted />
                        <button
                            className="btn btn-link theme-toggle-btn"
                            onClick={toggleTheme}
                            title={theme === "light" ? t("darkMode") : t("lightMode")}
                        >
                            <i className={`bi ${theme === "light" ? "bi-moon" : "bi-sun"}`} />
                        </button>
                        <DropDownMenuElement
                            menus={userMenu}
                            variant="link"
                            align="end"
                            className="navbar-user-menu"
                            toggleContent={
                                <>
                                    <i className="bi bi-person-circle"></i>
                                </>
                            }
                        />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

NavBarFeature.displayName = "NavBarFeature";

export default NavBarFeature;
