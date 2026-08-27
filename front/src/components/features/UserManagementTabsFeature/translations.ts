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
    emailDescription: {
        en: "An email will be sent to the new address",
        fr: "Un email sera envoyé à la nouvelle adresse"
    },
    loading: {
        en: "Loading...",
        fr: "Chargement..."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UserManagementTabsFeature",
    translations
);

export const userManagementTabsFeatureConfig = config;
export const useUserManagementTabsFeatureTranslations = useTranslations;
export default config;