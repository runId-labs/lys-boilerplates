import {PageDescriptionType} from "lys-front/types";
import HomePage from "./index";
import translation from "./translation";
import PrivatePageTemplate from "@/components/pageTemplates/PrivatePageTemplate";

export const homePage: PageDescriptionType = {
    name: "HomePage",
    component: HomePage,
    template: PrivatePageTemplate,
    translation: translation,
    type: "private",
    path: "/home",
    breadcrumbs: [],
    // TODO: Update description for your project
    description: "Home page: welcome dashboard."
}
