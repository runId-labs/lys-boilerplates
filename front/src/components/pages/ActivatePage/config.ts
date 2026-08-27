import {PageDescriptionType} from "lys-front/types";
import ActivatePage from "./index";
import translation from "./translation";

export const activatePage: PageDescriptionType = {
    name: "ActivatePage",
    component: ActivatePage,
    translation: translation,
    type: "public",
    path: "/activate",
    breadcrumbs: [],
    options: {
        opened: true  // Allow access even when authenticated
    }
};