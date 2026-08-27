import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    buttonText: {
        en: "Manage User",
        fr: "Gérer l'utilisateur"
    },
    offcanvasTitle: {
        en: "User Management",
        fr: "Gestion de l'utilisateur"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "GetAdminRestricted",
    translations
);

export const getAdminRestrictedConfig = config;
export const useGetAdminRestrictedTranslations = useTranslations;
export default config;