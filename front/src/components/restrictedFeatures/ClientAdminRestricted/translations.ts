import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Error states
    noClient: {
        en: "You are not associated with any client organization.",
        fr: "Vous n'êtes associé à aucune organisation cliente."
    },
    noPermission: {
        en: "You do not have permission to view this client.",
        fr: "Vous n'avez pas la permission de voir ce client."
    }
} as const;

export type ClientAdminRestrictedTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ClientAdminRestricted",
    translations
);

export const clientAdminRestrictedConfig = config;
export const useClientAdminRestrictedTranslations = useTranslations;
export default config;