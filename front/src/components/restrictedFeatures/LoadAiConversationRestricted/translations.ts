import {createComponentTranslations} from "@/tools/translationTools";

/**
 * No user-facing string: the component renders nothing, it only loads a conversation.
 * The config is still registered, as every component's translations table must be.
 */
const translations = {} as const;

const {config, useTranslations} = createComponentTranslations(
    "LoadAiConversationRestricted",
    translations
);

export const loadAiConversationRestrictedConfig = config;
export const useLoadAiConversationRestrictedTranslations = useTranslations;
export default config;
