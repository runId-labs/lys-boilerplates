import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    showArchive: {
        en: "Browse the archive",
        fr: "Voir les archives"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ListAiConversationRestricted",
    translations
);

export const listAiConversationRestrictedConfig = config;
export const useListAiConversationRestrictedTranslations = useTranslations;
export default config;
