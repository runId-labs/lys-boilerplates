import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    dialogTitle: {
        en: "Bill this client manually",
        fr: "Facturer ce client manuellement"
    },

    // What the switch does
    effect: {
        en: "The switch collects nothing and stops nothing: it hands billing over to you. You invoice the client and assign their offer yourself.",
        fr: "La bascule ne prélève rien et n'arrête rien : elle vous confie la facturation. C'est vous qui facturez le client et qui lui attribuez son offre."
    },
    blocked: {
        en: "Only possible once no automatic collection is running. If the client is being charged, cancel the subscription first and wait for the cancellation to take effect.",
        fr: "Possible uniquement quand plus aucun prélèvement n'est en cours. Si le client est prélevé, résiliez d'abord son abonnement et attendez que la résiliation prenne effet."
    },
    reverse: {
        en: "The way back needs nothing: the client's first successful online payment puts them back on automatic billing.",
        fr: "Le retour ne demande rien : le premier paiement en ligne réussi du client le replace en facturation automatique."
    },

    // Button
    submit: {
        en: "Switch to manual billing",
        fr: "Passer en facturation manuelle"
    },

    // Feedback
    success: {
        en: "Billing updated",
        fr: "Facturation mise à jour"
    },
    error: {
        en: "Unable to change the billing",
        fr: "Impossible de changer la facturation"
    }
} as const;

export type SetSubscriptionBillingModeTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "SetSubscriptionBillingModeRestricted",
    translations
);

export const setSubscriptionBillingModeRestrictedConfig = config;
export const useSetSubscriptionBillingModeRestrictedTranslations = useTranslations;
export default config;
