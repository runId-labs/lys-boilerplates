import {PageDescriptionType} from "lys-front/types";
import NotFoundDefaultPage from "./index";
import translation from "./translation";


export const notFoundDefaultPage: PageDescriptionType = {
    name: "NotFoundDefaultPage",
    component: NotFoundDefaultPage,
    translation: translation,
    type: "public",
    path: "/notfound",
    breadcrumbs: []
}
