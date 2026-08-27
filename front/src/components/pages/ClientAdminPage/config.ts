import {PageDescriptionType} from "lys-front/types";
import ClientAdminPage from "./index";
import translation from "./translation";
import AdministrationTabsPageTemplate from "@/components/pageTemplates/AdministrationTabsPageTemplate";

/**
 * ClientAdminPage configuration
 * Administration section - displays connected user's client organization
 */
export const clientAdminPage: PageDescriptionType = {
    name: "ClientAdminPage",
    component: ClientAdminPage,
    template: AdministrationTabsPageTemplate,
    translation: translation,
    type: "private",
    path: "/administration/client",
    breadcrumbs: [],
    mainWebserviceName: "client",
    description: "Client administration - view client details and manage subscription"
};