import {createComponentTranslations} from "@/tools/translationTools";

const translations = {} as const;

const {config, useTranslations} = createComponentTranslations(
    "ChatbotDialogButtonFeature",
    translations
);

export const chatbotDialogButtonFeatureConfig = config;
export const useChatbotDialogButtonFeatureTranslations = useTranslations;
export default config;
