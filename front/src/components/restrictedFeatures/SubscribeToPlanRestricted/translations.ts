import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Button
    buttonText: {
        en: "Subscribe",
        fr: "S'abonner"
    },
    loading: {
        en: "Redirecting...",
        fr: "Redirection..."
    },

    // Success messages
    downgradeScheduled: {
        en: "Your plan change has been scheduled",
        fr: "Votre changement de plan a été programmé"
    },

    // Errors
    errorGeneric: {
        en: "Failed to change subscription",
        fr: "Impossible de modifier l'abonnement"
    },
    AUTHENTICATION_REQUIRED_ERROR: {
        en: "Authentication required",
        fr: "Authentification requise"
    },
    CHECKOUT_SESSION_FAILED_ERROR: {
        en: "Failed to create payment session",
        fr: "Échec de la création de la session de paiement"
    },
    NOT_CLIENT_ASSOCIATED_USER_ERROR: {
        en: "Your account is not associated with any organization",
        fr: "Votre compte n'est associé à aucune organisation"
    },
    PLAN_NOT_FOUND_ERROR: {
        en: "Plan not found",
        fr: "Plan introuvable"
    },
    SAME_PLAN_ERROR: {
        en: "You are already on this plan",
        fr: "Vous êtes déjà sur ce plan"
    },
    NO_ACTIVE_SUBSCRIPTION_ERROR: {
        en: "No active subscription found",
        fr: "Aucun abonnement actif trouvé"
    }
} as const;

export type SubscribeToPlanTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "SubscribeToPlanRestricted",
    translations
);

export const subscribeToPlanRestrictedConfig = config;
export const useSubscribeToPlanRestrictedTranslations = useTranslations;
export default config;