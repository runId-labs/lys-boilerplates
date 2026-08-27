import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    improve: {
        en: "Improve",
        fr: "Ameliorer"
    },
    undo: {
        en: "Undo",
        fr: "Annuler"
    },
    redo: {
        en: "Redo",
        fr: "Retablir"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "TextareaWithAiRestricted",
    translations
);

export const textareaWithAiRestrictedConfig = config;
export const useTextareaWithAiRestrictedTranslations = useTranslations;
export type TextareaWithAiRestrictedTranslationKey = keyof typeof translations;