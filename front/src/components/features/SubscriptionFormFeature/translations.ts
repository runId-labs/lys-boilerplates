import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Section titles
    sectionPlan: {
        en: "Plan Information",
        fr: "Informations de la licence"
    },
    sectionPricing: {
        en: "Pricing",
        fr: "Tarification"
    },
    sectionRules: {
        en: "Rules",
        fr: "Règles"
    },

    // Labels
    labelPlan: {
        en: "Plan",
        fr: "Licence"
    },
    labelPriceMonthly: {
        en: "Monthly price",
        fr: "Prix mensuel"
    },
    labelPriceYearly: {
        en: "Yearly price",
        fr: "Prix annuel"
    },
    labelHasPendingDowngrade: {
        en: "Pending downgrade",
        fr: "Déclassement en attente"
    },

    // Rule values
    ruleEnabled: {
        en: "Enabled",
        fr: "Activé"
    },
    ruleUnlimited: {
        en: "Unlimited",
        fr: "Illimité"
    }
} as const;

export type SubscriptionFormTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "SubscriptionFormFeature",
    translations
);

export const subscriptionFormFeatureConfig = config;
export const useSubscriptionFormFeatureTranslations = useTranslations;
export default config;