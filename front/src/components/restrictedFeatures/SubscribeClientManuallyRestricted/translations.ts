import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    dialogTitle: {
        en: "Subscribe this client manually",
        fr: "Abonner le client manuellement"
    },
    dialogLead: {
        en: "No payment is taken.",
        fr: "Aucun paiement n'est prélevé."
    },
    dialogMessage: {
        en: "The client is placed on the chosen price and their billing switches to manual: you invoice them outside the application.",
        fr: "Le client est placé sur le tarif choisi et sa facturation bascule en manuelle : vous le facturez hors de l'application."
    },

    // Current subscription
    currentTitle: {
        en: "Current subscription",
        fr: "Abonnement en cours"
    },
    currentNone: {
        en: "No priced subscription",
        fr: "Aucun abonnement tarifé"
    },
    currentCommittedUntil: {
        en: "Committed until {date}",
        fr: "Engagé jusqu'au {date}"
    },
    retiredWarning: {
        en: "This price comes from a retired version: once changed, it can no longer be selected.",
        fr: "Ce tarif provient d'une version retirée : une fois changé, il ne sera plus sélectionnable."
    },

    // Form
    founderSigned: {
        en: "Founder Customer programme signed by {email} on {date} (version {version}) — "
            + "the discount is applied",
        fr: "Programme Founder Customer signé par {email} le {date} (version {version}) — "
            + "la remise est appliquée"
    },
    submit: {
        en: "Subscribe",
        fr: "Abonner"
    },

    // Feedback
    success: {
        en: "Client subscribed",
        fr: "Client abonné"
    },
    error: {
        en: "Unable to subscribe the client",
        fr: "Impossible d'abonner le client"
    }
} as const;

export type SubscribeClientManuallyTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "SubscribeClientManuallyRestricted",
    translations
);

export const subscribeClientManuallyRestrictedConfig = config;
export const useSubscribeClientManuallyRestrictedTranslations = useTranslations;
export default config;
