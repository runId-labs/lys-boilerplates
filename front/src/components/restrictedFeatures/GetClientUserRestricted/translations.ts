import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    buttonText: {
        en: "Manage",
        fr: "Gérer"
    },
    offcanvasTitle: {
        en: "Client User Management",
        fr: "Gestion utilisateur client"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "GetClientUserRestricted",
    translations
);

export const getClientUserRestrictedConfig = config;
export const useGetClientUserRestrictedTranslations = useTranslations;
export default config;
