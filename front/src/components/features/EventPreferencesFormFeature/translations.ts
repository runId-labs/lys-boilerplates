import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    email: {
        en: "Email",
        fr: "Email"
    },
    notification: {
        en: "In-app Notification",
        fr: "Notification dans l'application"
    },
    eventTypeLabel: {
        en: "Event Type",
        fr: "Type d'événement"
    },
    blockedTooltip: {
        en: "This notification cannot be disabled",
        fr: "Cette notification ne peut pas être désactivée"
    },
    noConfigurableEvents: {
        en: "No configurable notifications available.",
        fr: "Aucune notification configurable disponible."
    },
    // Category translations
    categoryAccount: {
        en: "Account",
        fr: "Compte"
    },
    categoryLicense: {
        en: "License",
        fr: "Licence"
    },
    categorySubscription: {
        en: "Subscription",
        fr: "Abonnement"
    },
    categoryOther: {
        en: "Other",
        fr: "Autre"
    },
    // Event type translations (matching backend EVENT_CHANNELS keys)
    USER_INVITED: {
        en: "User Invited",
        fr: "Utilisateur invité"
    },
    USER_EMAIL_VERIFICATION_REQUESTED: {
        en: "Email Verification Requested",
        fr: "Vérification d'email demandée"
    },
    USER_PASSWORD_RESET_REQUESTED: {
        en: "Password Reset Requested",
        fr: "Réinitialisation de mot de passe demandée"
    },
    LICENSE_GRANTED: {
        en: "License Granted",
        fr: "Licence accordée"
    },
    LICENSE_REVOKED: {
        en: "License Revoked",
        fr: "Licence révoquée"
    },
    SUBSCRIPTION_PAYMENT_SUCCESS: {
        en: "Subscription Payment Successful",
        fr: "Paiement d'abonnement réussi"
    },
    SUBSCRIPTION_CANCELED: {
        en: "Subscription Canceled",
        fr: "Abonnement annulé"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "EventPreferencesFormFeature",
    translations
);

export const eventPreferencesFormFeatureConfig = config;
export const useEventPreferencesFormFeatureTranslations = useTranslations;
export default config;