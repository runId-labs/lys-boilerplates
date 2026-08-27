import {PageDescriptionType} from "lys-front/types";
import ListClientPage from "./index";
import translation from "./translation";
import SupervisionTabsPageTemplate from "@/components/pageTemplates/SupervisionTabsPageTemplate";

/**
 * ListClientPage configuration
 * Supervision section - requires transversal admin access
 */
export const listClientPage: PageDescriptionType = {
    name: "ListClientPage",
    component: ListClientPage,
    template: SupervisionTabsPageTemplate,
    translation: translation,
    type: "private",
    path: "/supervision/clients",
    breadcrumbs: [],
    mainWebserviceName: "allClients",
    description: "Client management - list, search, and manage client organizations"
};
