import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    logout: {
        en: "Logout",
        fr: "Déconnexion"
    },
    accountSettings: {
        en: "Account Settings",
        fr: "Paramètres du compte"
    },
    myAccount: {
        en: "My Account",
        fr: "Mon compte"
    },
    administration: {
        en: "Administration",
        fr: "Administration"
    },
    supervision: {
        en: "Supervision",
        fr: "Supervision"
    },
    darkMode: {
        en: "Dark mode",
        fr: "Mode sombre"
    },
    lightMode: {
        en: "Light mode",
        fr: "Mode clair"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "NavBarFeature",
    translations
);

export const navBarFeatureConfig = config;
export const useNavBarFeatureTranslations = useTranslations;