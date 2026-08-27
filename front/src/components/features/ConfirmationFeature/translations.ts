import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    confirm: {
        en: "Confirm",
        fr: "Confirmer"
    },
    cancel: {
        en: "Cancel",
        fr: "Annuler"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ConfirmationFeature",
    translations
);

export const confirmationFeatureConfig = config;
export const useConfirmationFeatureTranslations = useTranslations;
export default config;