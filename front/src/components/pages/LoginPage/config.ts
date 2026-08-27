import {PageDescriptionType} from "lys-front/types";
import translation from "./translation";
import LoginPage from "./index";


export const loginPage: PageDescriptionType = {
    name: "LoginPage",
    component: LoginPage,
    translation: translation,
    type: "public",
    path: "/login",
    breadcrumbs: []
}