import {PageDescriptionType} from "lys-front/types";
import ResetPasswordPage from "./index";
import translation from "./translation";

export const resetPasswordPage: PageDescriptionType = {
    name: "ResetPasswordPage",
    component: ResetPasswordPage,
    translation: translation,
    type: "public",
    path: "/reset-password",
    breadcrumbs: [],
    options: {
        opened: true  // Allow access even when authenticated
    }
};