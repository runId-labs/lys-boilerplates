/**
 * Description of a single tab.
 *
 * Each tab points to a real route in the application — clicking a tab is a
 * full navigation, not an in-page state change. This makes "tabs" a visual
 * grouping device while keeping URL as the single source of truth.
 */
export interface TabRoute {
    /** `RouteInterface.name` of the destination page. */
    routeName: string;
    /** Bootstrap icon class (optional, e.g. `bi-graph-up`). */
    icon?: string;
    /**
     * Optional short label key (looked up under `lys.services.navigation.`).
     * Useful when the page's `pageName` translation is too long for a tab
     * (e.g. "Tableau de bord Synthèse" → use `synthesisDashboard` → "Synthèse").
     * Falls back to the route's `pageName` when omitted.
     */
    labelKey?: string;
}

export interface TabsNavigationFeatureProps {
    /** Ordered list of tabs to display. Tabs the user cannot access are hidden. */
    tabs: TabRoute[];
}
