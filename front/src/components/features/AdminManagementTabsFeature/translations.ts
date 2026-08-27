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
    "AdminManagementTabsFeature",
    translations
);

export const adminManagementTabsFeatureConfig = config;
export const useAdminManagementTabsFeatureTranslations = useTranslations;
export default config;