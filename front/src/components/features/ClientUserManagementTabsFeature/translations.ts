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
    rolesTab: {
        en: "Roles",
        fr: "Rôles"
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
    "ClientUserManagementTabsFeature",
    translations
);

export const clientUserManagementTabsFeatureConfig = config;
export const useClientUserManagementTabsFeatureTranslations = useTranslations;
export default config;
