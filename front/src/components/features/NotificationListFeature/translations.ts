import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Notifications",
        fr: "Notifications"
    },
    noNotifications: {
        en: "No notifications",
        fr: "Aucune notification"
    },
    loadMore: {
        en: "Load more",
        fr: "Voir plus"
    },
    markAsRead: {
        en: "Mark as read",
        fr: "Marquer comme lu"
    },
    markAllAsRead: {
        en: "Mark all as read",
        fr: "Tout marquer comme lu"
    },
    justNow: {
        en: "Just now",
        fr: "A l'instant"
    },
    // License
    licenseGranted: {
        en: "New license granted: {licenseName}",
        fr: "Nouvelle licence accordée : {licenseName}"
    },
    licenseRevoked: {
        en: "License revoked: {licenseName}",
        fr: "Licence revoquee : {licenseName}"
    },
    // Subscription
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
    },
    unknownNotification: {
        en: "New notification",
        fr: "Nouvelle notification"
    },
    filterReadStatus: {
        en: "Read status",
        fr: "Statut de lecture"
    },
    filterReadStatusAll: {
        en: "All",
        fr: "Toutes"
    },
    filterReadStatusUnread: {
        en: "Unread",
        fr: "Non lues"
    },
    filterReadStatusRead: {
        en: "Read",
        fr: "Lues"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "NotificationListFeature",
    translations
);

export const notificationListFeatureConfig = config;
export const useNotificationListFeatureTranslations = useTranslations;
export default config;
