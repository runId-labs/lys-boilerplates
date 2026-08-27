import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    required: {
        en: "This field is required",
        fr: "Ce champ est requis"
    },
    submit: {
        en: "Submit",
        fr: "Soumettre"
    },
    reset: {
        en: "Reset",
        fr: "Réinitialiser"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "FormFeature",
    translations
);

export const formFeatureConfig = config;
export const useFormFeatureTranslations = useTranslations;