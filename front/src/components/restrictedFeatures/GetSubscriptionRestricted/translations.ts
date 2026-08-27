import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Button
    buttonText: {
        en: "Manage",
        fr: "Gérer"
    },

    // Offcanvas
    offcanvasTitle: {
        en: "Subscription Management",
        fr: "Gestion de l'abonnement"
    },

    // Card title
    cardTitle: {
        en: "Subscription Details",
        fr: "Détails de l'abonnement"
    },

    // Footer dates
    createdAt: {
        en: "Created on {date}",
        fr: "Créé le {date}"
    },
    updatedAt: {
        en: "Last updated on {date}",
        fr: "Dernière mise à jour le {date}"
    },

    // Plan selection
    planSelectionTitle: {
        en: "Choose a Plan",
        fr: "Choisir un abonnement"
    },
    upgradePlan: {
        en: "Upgrade",
        fr: "Améliorer"
    },
    changePlan: {
        en: "Change Plan",
        fr: "Modifier"
    },

    // Checkout summary
    checkoutSummaryTitle: {
        en: "Order Summary",
        fr: "Récapitulatif"
    },
    selectedPlan: {
        en: "Selected plan",
        fr: "Abonnement sélectionné"
    },
    billingPeriodLabel: {
        en: "Billing period",
        fr: "Période de facturation"
    },
    commitmentLabel: {
        en: "Commitment",
        fr: "Engagement"
    },
    monthly: {
        en: "Monthly",
        fr: "Mensuel"
    },
    yearly: {
        en: "Yearly",
        fr: "Annuel"
    },
    totalPrice: {
        en: "Total",
        fr: "Total"
    },
    free: {
        en: "Free",
        fr: "Gratuit"
    },
    backToPlans: {
        en: "Back to plans",
        fr: "Retour aux abonnements"
    }
} as const;

export type GetSubscriptionTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "GetSubscriptionRestricted",
    translations
);

export const getSubscriptionRestrictedConfig = config;
export const useGetSubscriptionRestrictedTranslations = useTranslations;
export default config;
