import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Title
    title: {
        en: "Choose a plan",
        fr: "Choisir un plan"
    },

    // Commitment
    commitmentDiscount: {
        en: "Save {percent}%",
        fr: "Économisez {percent}%"
    },

    // Plan card
    currentPlan: {
        en: "Current plan",
        fr: "Plan actuel"
    },
    selectPlan: {
        en: "Select",
        fr: "Choisir"
    },
    unavailableForCommitment: {
        en: "Not offered on this commitment",
        fr: "Non proposée sur cet engagement"
    },
    perMonth: {
        en: "/month",
        fr: "/mois"
    },
    perYear: {
        en: "/year",
        fr: "/an"
    },
    free: {
        en: "Free",
        fr: "Gratuit"
    },

    // States
    loading: {
        en: "Loading plans...",
        fr: "Chargement des plans..."
    },
    noPlans: {
        en: "No plans available",
        fr: "Aucun plan disponible"
    },
    noPermission: {
        en: "You don't have permission to view plans",
        fr: "Vous n'avez pas la permission de voir les plans"
    },
    contactUs: {
        en: "Contact us",
        fr: "Contactez-nous"
    }
} as const;

export type ListActiveLicensePlansTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ListActiveLicensePlansRestricted",
    translations
);

export const listActiveLicensePlansRestrictedConfig = config;
export const useListActiveLicensePlansRestrictedTranslations = useTranslations;
export default config;