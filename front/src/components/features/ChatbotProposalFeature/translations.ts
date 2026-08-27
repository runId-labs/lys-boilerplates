import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Save this information?",
        fr: "Enregistrer cette information ?"
    },
    confirm: {
        en: "Confirm",
        fr: "Confirmer"
    },
    modify: {
        en: "Modify",
        fr: "Modifier"
    },
    dismiss: {
        en: "Dismiss",
        fr: "Ignorer"
    },
    confirmModification: {
        en: "Confirm modification",
        fr: "Confirmer la modification"
    },
    cancel: {
        en: "Cancel",
        fr: "Annuler"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ChatbotProposalFeature",
    translations
);

export const chatbotProposalFeatureConfig = config;
export const useChatbotProposalFeatureTranslations = useTranslations;
export default config;