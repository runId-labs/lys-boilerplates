import React, {useMemo} from "react";
import {useIntl} from "react-intl";
import {useRouteInfo, useRouteAccess, useUrlQueries} from "lys-front/providers";
import LinkRestricted from "@/components/restrictedFeatures/LinkRestricted";
import {NAVIGATION_TRANS_PREFIX} from "@/services/navigation";
import {TabsNavigationFeatureProps} from "./types";
import "./styles.scss";

/**
 * TabsNavigationFeature component
 *
 * Renders a Bootstrap `nav-tabs` bar where each "tab" is a real route. Clicking
 * a tab navigates to its page while preserving the current URL query parameters,
 * so shared filter values survive the switch.
 *
 * Tabs the user cannot access (per the destination route's `mainWebserviceName`)
 * are hidden, courtesy of `LinkRestricted`.
 *
 * Active state is derived from the currently active route — no local state.
 *
 * Visual style is inherited from `TabElement` by wrapping the output in the
 * `.tab-element` container — same selectors apply (border-bottom 3px, primary
 * color on active, transitions, dark theme).
 */
const TabsNavigationFeature: React.FC<TabsNavigationFeatureProps> = ({tabs}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const intl = useIntl();
    const {route: currentRoute, allRoutes} = useRouteInfo();
    const {appliedParams} = useUrlQueries();
    const hasRouteAccess = useRouteAccess();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Snapshot of the current URL query params, forwarded as `queryParameters`
     * to each tab link so filter values persist across tabs.
     */
    const queryParameters = useMemo<Record<string, string>>(() => {
        const params: Record<string, string> = {};
        appliedParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }, [appliedParams]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <div className="tab-element tabs-navigation-feature">
            <ul className="nav nav-tabs">
                {tabs.map(({routeName, icon, labelKey}) => {
                    const route = allRoutes[routeName];
                    if (!route || !hasRouteAccess(route)) return null;

                    const isActive = currentRoute?.name === routeName;
                    const label = labelKey
                        ? intl.formatMessage({id: NAVIGATION_TRANS_PREFIX + labelKey})
                        : intl.formatMessage({id: route.transPrefix + "pageName"});

                    return (
                        <li key={routeName} className="nav-item">
                            <LinkRestricted
                                route={route}
                                queryParameters={queryParameters}
                                className={`nav-link${isActive ? " active" : ""}`}
                            >
                                {icon && <i className={`bi ${icon} me-2`} />}
                                {label}
                            </LinkRestricted>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

TabsNavigationFeature.displayName = "TabsNavigationFeature";

export default TabsNavigationFeature;
