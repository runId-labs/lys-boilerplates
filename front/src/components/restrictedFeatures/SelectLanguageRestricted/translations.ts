import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Language",
        fr: "Langue"
    },
    // Language codes
    EN: {
        en: "English",
        fr: "Anglais"
    },
    FR: {
        en: "French",
        fr: "Français"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectLanguageRestricted",
    translations
);

export const selectLanguageRestrictedConfig = config;
export const useSelectLanguageRestrictedTranslations = useTranslations;
export type SelectLanguageTranslationKey = keyof typeof translations;