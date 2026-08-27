import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    pageName: {
        en: "My Organization",
        fr: "Mon organisation"
    },
    title: {
        en: "My Organization",
        fr: "Mon organisation"
    },
    paymentPending: {
        en: "Your payment is being processed. Your subscription will be updated shortly.",
        fr: "Votre paiement est en cours de traitement. Votre abonnement sera mis à jour sous peu."
    },
    paymentSuccess: {
        en: "Your payment was successful! Your subscription has been updated.",
        fr: "Votre paiement a été effectué avec succès ! Votre abonnement a été mis à jour."
    },
    paymentFailed: {
        en: "Your payment could not be processed. Please try again.",
        fr: "Votre paiement n'a pas pu être traité. Veuillez réessayer."
    },
    paymentCancelled: {
        en: "Payment was cancelled.",
        fr: "Le paiement a été annulé."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ClientAdminPage",
    translations
);

export const useClientAdminPageTranslations = useTranslations;
export default config.translation;