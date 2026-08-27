import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Hi, I'm your assistant",
        fr: "Bonjour, je suis votre assistant"
    },
    subtitle: {
        en: "How can I help you today?",
        fr: "Comment puis-je vous aider aujourd'hui ?"
    },
    placeholder: {
        en: "Type your message...",
        fr: "Tapez votre message..."
    },
    send: {
        en: "Send",
        fr: "Envoyer"
    },
    close: {
        en: "Close",
        fr: "Fermer"
    },
    errorMessage: {
        en: "Failed to send message. Please try again.",
        fr: "Échec de l'envoi du message. Veuillez réessayer."
    },
    // Progress labels: business wording only — the assistant's tool names must never
    // reach the user. Project-specific tool labels are added here (see the
    // activityLabelKeys prop of ChatbotRestricted).
    activityGeneric: {
        en: "Gathering data",
        fr: "Récupération de données"
    },
    activityWriting: {
        en: "Writing the answer",
        fr: "Rédaction de la réponse"
    },
    thinking: {
        en: "Thinking…",
        fr: "Réflexion…"
    },
    enlargeWindow: {
        en: "Enlarge",
        fr: "Agrandir"
    },
    reduceWindow: {
        en: "Reduce",
        fr: "Réduire"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ChatbotRestricted",
    translations
);

export const chatbotRestrictedConfig = config;
export const useChatbotRestrictedTranslations = useTranslations;
export default config;
