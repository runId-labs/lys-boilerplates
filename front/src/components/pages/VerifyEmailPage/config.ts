import {PageDescriptionType} from "lys-front/types";
import VerifyEmailPage from "./index";
import translation from "./translation";

export const verifyEmailPage: PageDescriptionType = {
    name: "VerifyEmailPage",
    component: VerifyEmailPage,
    translation: translation,
    type: "public",
    path: "/verify-email",
    breadcrumbs: [],
    options: {
        opened: true  // Allow access even when authenticated
    }
};
