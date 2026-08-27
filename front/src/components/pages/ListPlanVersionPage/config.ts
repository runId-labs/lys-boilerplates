import {PageDescriptionType} from "lys-front/types";
import ListPlanVersionPage from "./index";
import translation from "./translation";
import SupervisionTabsPageTemplate from "@/components/pageTemplates/SupervisionTabsPageTemplate";

/**
 * ListPlanVersionPage configuration
 * Supervision section - subscription catalogue management
 */
export const listPlanVersionPage: PageDescriptionType = {
    name: "ListPlanVersionPage",
    component: ListPlanVersionPage,
    template: SupervisionTabsPageTemplate,
    translation: translation,
    type: "private",
    path: "/supervision/subscriptions",
    breadcrumbs: [],
    mainWebserviceName: "allLicensePlanVersions",
    description: "Subscription management - list plan versions, their prices and availability"
};
