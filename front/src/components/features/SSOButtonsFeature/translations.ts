import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    dividerLogin: {
        en: "or sign in with",
        fr: "ou se connecter avec"
    },
    dividerSignup: {
        en: "or sign up by email",
        fr: "ou s'inscrire par email"
    },
    dividerLink: {
        en: "Link account with",
        fr: "Lier le compte avec"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SSOButtonsFeature",
    translations
);

export const ssoButtonsFeatureConfig = config;
export const useSSOButtonsTranslations = useTranslations;
