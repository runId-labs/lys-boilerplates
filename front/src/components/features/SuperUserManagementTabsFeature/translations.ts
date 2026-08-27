import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    privateDataTab: {
        en: "Personal Information",
        fr: "Informations personnelles"
    },
    emailTab: {
        en: "Email Address",
        fr: "Adresse email"
    },
    loading: {
        en: "Loading...",
        fr: "Chargement..."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SuperUserManagementTabsFeature",
    translations
);

export const superUserManagementTabsFeatureConfig = config;
export const useSuperUserManagementTabsFeatureTranslations = useTranslations;
export default config;