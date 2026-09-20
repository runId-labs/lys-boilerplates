import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    empty: {
        en: "No conversation yet.",
        fr: "Aucune conversation pour l'instant."
    },
    current: {
        en: "Current",
        fr: "En cours"
    },
    untitled: {
        en: "Untitled conversation",
        fr: "Conversation sans titre"
    },
    rename: {
        en: "Rename",
        fr: "Renommer"
    },
    renameLabel: {
        en: "Conversation title",
        fr: "Titre de la conversation"
    },
    save: {
        en: "Save",
        fr: "Enregistrer"
    },
    cancel: {
        en: "Cancel",
        fr: "Annuler"
    },
    archive: {
        en: "Archive",
        fr: "Archiver"
    },
    unarchive: {
        en: "Restore",
        fr: "Restaurer"
    },
    archived: {
        en: "Archived",
        fr: "Archivée"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "AiConversationListFeature",
    translations
);

export const aiConversationListFeatureConfig = config;
export const useAiConversationListFeatureTranslations = useTranslations;
export default config;
