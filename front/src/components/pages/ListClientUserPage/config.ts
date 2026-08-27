import {PageDescriptionType} from "lys-front/types";
import ListClientUserPage from "./index";
import translation from "./translation";
import AdministrationTabsPageTemplate from "@/components/pageTemplates/AdministrationTabsPageTemplate";

/**
 * ListClientUserPage configuration
 * Administration section - requires transversal admin access
 */
export const listClientUserPage: PageDescriptionType = {
    name: "ListClientUserPage",
    component: ListClientUserPage,
    template: AdministrationTabsPageTemplate,
    translation: translation,
    type: "private",
    path: "/administration/client-users",
    breadcrumbs: [],
    mainWebserviceName: "allClientUsers",
    description: "Client user management - list, search, and manage users across all clients"
};
