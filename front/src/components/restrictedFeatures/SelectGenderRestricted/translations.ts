import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Gender",
        fr: "Genre"
    },
    // Gender codes
    MALE: {
        en: "Male",
        fr: "Homme"
    },
    FEMALE: {
        en: "Female",
        fr: "Femme"
    },
    OTHER: {
        en: "Other",
        fr: "Autre"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectGenderRestricted",
    translations
);

export const selectGenderRestrictedConfig = config;
export const useSelectGenderRestrictedTranslations = useTranslations;
export type SelectGenderTranslationKey = keyof typeof translations;