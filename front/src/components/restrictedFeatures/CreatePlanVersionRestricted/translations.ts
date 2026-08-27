import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Trigger button and dialog (resolved by the hook through react-intl)
    buttonLabel: {
        en: "Publish a version",
        fr: "Publier une version"
    },
    dialogTitle: {
        en: "Publish a plan version",
        fr: "Publier une version d'offre"
    },

    // Sections
    sectionPlan: {
        en: "Plan",
        fr: "Offre"
    },
    sectionPrices: {
        en: "Prices",
        fr: "Tarifs"
    },
    sectionRules: {
        en: "Quotas",
        fr: "Quotas"
    },

    // Labels
    labelPlan: {
        en: "Plan",
        fr: "Offre"
    },
    labelPeriod: {
        en: "Billing period",
        fr: "Périodicité de facturation"
    },
    labelPriceNoCommitment: {
        en: "Price without commitment",
        fr: "Tarif sans engagement"
    },
    labelPriceOneYear: {
        en: "Price with a one year commitment",
        fr: "Tarif engagement 1 an"
    },
    labelPriceTwoYears: {
        en: "Price with a two years commitment",
        fr: "Tarif engagement 2 ans"
    },
    labelPriceThreeYears: {
        en: "Price with a three years commitment",
        fr: "Tarif engagement 3 ans"
    },
    labelMaxUsers: {
        en: "User limit",
        fr: "Limite d'utilisateurs"
    },

    // Help
    rulesHelp: {
        en: "Leave a field empty for no limit. Quotas are always attached to the version: a version published without them is sellable and unrestricted.",
        fr: "Laissez un champ vide pour ne pas limiter. Les quotas sont toujours rattachés à la version : une version publiée sans eux est vendable et sans restriction."
    },
    pricesHelp: {
        en: "Amounts in euros for one billing period. Leave a field empty to not sell that commitment. A version with no price at all is free.",
        fr: "Montants en euros pour une période de facturation. Laissez un champ vide pour ne pas vendre cet engagement. Une version sans aucun tarif est gratuite."
    },

    // Submit
    submit: {
        en: "Publish version",
        fr: "Publier la version"
    },

    // Feedback
    createSuccess: {
        en: "Plan version published",
        fr: "Version d'offre publiée"
    },
    createError: {
        en: "Unable to publish the plan version",
        fr: "Impossible de publier la version d'offre"
    },
    invalidAmount: {
        en: "Prices must be positive amounts",
        fr: "Les tarifs doivent être des montants positifs"
    },
    invalidLimit: {
        en: "Quotas must be positive whole numbers",
        fr: "Les quotas doivent être des nombres entiers positifs"
    }
} as const;

export type CreatePlanVersionTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "CreatePlanVersionRestricted",
    translations
);

export const createPlanVersionRestrictedConfig = config;
export const useCreatePlanVersionRestrictedTranslations = useTranslations;
export default config;
