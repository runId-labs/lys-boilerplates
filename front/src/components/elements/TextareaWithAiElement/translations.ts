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
    },
    enlarge: {
        en: "Enlarge",
        fr: "Agrandir"
    },
    reduce: {
        en: "Reduce",
        fr: "Réduire"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "TextareaWithAiElement",
    translations
);

export const textareaWithAiElementConfig = config;
export const useTextareaWithAiElementTranslations = useTranslations;
export default config;