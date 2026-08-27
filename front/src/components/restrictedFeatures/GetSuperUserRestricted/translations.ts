import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    buttonText: {
        en: "Manage Super User",
        fr: "Gérer le super utilisateur"
    },
    offcanvasTitle: {
        en: "Super User Management",
        fr: "Gestion du super utilisateur"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "GetSuperUserRestricted",
    translations
);

export const getSuperUserRestrictedConfig = config;
export const useGetSuperUserRestrictedTranslations = useTranslations;
export default config;