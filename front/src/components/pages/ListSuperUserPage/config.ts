import {PageDescriptionType} from "lys-front/types";
import ListSuperUserPage from "./index";
import translation from "./translation";
import SupervisionTabsPageTemplate from "@/components/pageTemplates/SupervisionTabsPageTemplate";

export const listSuperUserPage: PageDescriptionType = {
    name: "ListSuperUserPage",
    component: ListSuperUserPage,
    template: SupervisionTabsPageTemplate,
    translation: translation,
    type: "private",
    path: "/supervision/super-users",
    breadcrumbs: [],
    mainWebserviceName: "allSuperUsers",
    description: "Super user management - list and manage super users"
};