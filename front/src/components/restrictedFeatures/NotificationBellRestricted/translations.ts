import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    notifications: {
        en: "Notifications",
        fr: "Notifications"
    },
    newNotification: {
        en: "New notification",
        fr: "Nouvelle notification"
    },
    // License notifications
    licenseGranted: {
        en: "New license granted: {licenseName}",
        fr: "Nouvelle licence accordée : {licenseName}"
    },
    licenseRevoked: {
        en: "License revoked: {licenseName}",
        fr: "Licence révoquée : {licenseName}"
    },
    // Subscription notifications
    subscriptionPaymentSuccess: {
        en: "Payment successful for {planName}",
        fr: "Paiement réussi pour {planName}"
    },
    subscriptionPaymentFailed: {
        en: "Payment failed for subscription",
        fr: "Paiement échoué pour l'abonnement"
    },
    subscriptionCanceled: {
        en: "Subscription canceled - access until {effectiveDate}",
        fr: "Abonnement annulé - accès jusqu'au {effectiveDate}"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "NotificationBellRestricted",
    translations
);

export const notificationBellRestrictedConfig = config;
export const useNotificationBellRestrictedTranslations = useTranslations;
export default config;
