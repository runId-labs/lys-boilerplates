import {TabRoute} from "@/components/features/TabsNavigationFeature/types";

/**
 * Tabs displayed at the top of every Supervision page. Order = tab order.
 * Each tab is a real route — labels resolve to each page's `pageName`
 * translation. Tabs the user cannot access are hidden via the destination
 * route's `mainWebserviceName`.
 */
export const SUPERVISION_TABS: TabRoute[] = [
    {routeName: "ListClientPage", icon: "bi-people"},
    {routeName: "ListPlanVersionPage", icon: "bi-credit-card"},
    {routeName: "ListAdminPage", icon: "bi-shield-check"},
    {routeName: "ListSuperUserPage", icon: "bi-person-fill-gear"}
];
