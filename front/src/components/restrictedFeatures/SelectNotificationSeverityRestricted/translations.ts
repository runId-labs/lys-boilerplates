import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Level",
        fr: "Niveau"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectNotificationSeverityRestricted",
    translations
);

export const selectNotificationSeverityRestrictedConfig = config;
export const useSelectNotificationSeverityRestrictedTranslations = useTranslations;
export default config;