import {TabRoute} from "@/components/features/TabsNavigationFeature/types";

/**
 * Tabs displayed at the top of every Administration page. Order = tab order.
 * Each tab is a real route — labels resolve to each page's `pageName`
 * translation. Tabs the user cannot access are hidden via the destination
 * route's `mainWebserviceName`.
 */
export const ADMINISTRATION_TABS: TabRoute[] = [
    {routeName: "ClientAdminPage", icon: "bi-building-gear"},
    {routeName: "ListClientUserPage", icon: "bi-person-badge"}
];
