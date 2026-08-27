import {PageDescriptionType} from "lys-front/types";
import ListAdminPage from "./index";
import translation from "./translation";
import SupervisionTabsPageTemplate from "@/components/pageTemplates/SupervisionTabsPageTemplate";

export const listAdminPage: PageDescriptionType = {
    name: "ListAdminPage",
    component: ListAdminPage,
    template: SupervisionTabsPageTemplate,
    translation: translation,
    type: "private",
    path: "/supervision/admins",
    breadcrumbs: [],
    mainWebserviceName: "allUsers",
    description: "Administrator management - list, search, and manage admin users"
};
