/**
 * Menu link interface
 * Represents a single link in a menu section
 */
export interface MenuLink {
    routeName: string;                          // Route name (e.g., "HomePage")
    labelKey: string;                           // Translation key from navigation service
    icon?: string;                              // Bootstrap icon class
    order?: number;                             // Display order
    queryParameters?: Record<string, string>;   // Query params appended to URL (e.g., {isActive: "true"})
}

/**
 * Direct link section (no accordion, direct navigation).
 *
 * Active-state convention (handled by `NavBarFeature`):
 *   the button is highlighted when the current route's path equals
 *   `pathPrefix` exactly, or starts with `pathPrefix + "/"`.
 *   `pathPrefix` defaults to `/<id>` — so by convention the section's `id`
 *   must match the URL prefix used by every page reachable from it
 *   (e.g. id `"analysis"` covers `/analysis/synthesis`, `/analysis/financial`…).
 *   Set `pathPrefix` explicitly when the URL doesn't follow `/<id>` (e.g.
 *   home points to `/`, not `/home`).
 */
export interface DirectLinkSection {
    id: string;
    labelKey: string;      // Translation key from navigation service
    icon: string;          // Bootstrap icon class
    order: number;         // Display order
    link: MenuLink;        // Single direct link
    /**
     * Override of the URL prefix used to derive active state. Defaults to
     * `/<id>`. Set this when the section's id does not match the URL path.
     */
    pathPrefix?: string;
}

/**
 * Collapsible section with multiple links (accordion behavior)
 */
export interface CollapsibleSection {
    id: string;
    labelKey: string;      // Translation key from navigation service
    icon: string;          // Bootstrap icon class
    order: number;         // Display order
    links: MenuLink[];     // Multiple links in accordion
}

/**
 * Menu section type (union of direct link and collapsible section)
 */
export type MenuSection = DirectLinkSection | CollapsibleSection;

/**
 * Menu sections configuration
 * Defines the menu structure for the sidebar

/**
 * Menu sections configuration
 * Defines the menu structure for the sidebar
 *
 * Uses route names instead of full RouteInterface objects to avoid circular dependencies:
 * - Pages import PrivatePageTemplate
 * - PrivatePageTemplate imports SidebarMenuFeature
 * - SidebarMenuFeature imports menuSections
 * - menuSections should NOT import page configs (circular!)
 *
 * Routes are resolved at runtime via RouteProvider's allRoutes map.
 *
 * Each link uses LinkRestricted which checks permissions via mainWebserviceName.
 * Sections with no accessible links are automatically hidden.
 */
export const menuSections: MenuSection[] = [
    {
        id: "home",
        labelKey: "home",
        icon: "bi-house",
        order: 0,
        link: {
            routeName: "HomePage",
            labelKey: "home"
        }
    },
    // TODO: Add your business menu sections here
    // Administration and Supervision live in the navbar's user dropdown, not here.
];
