import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Card title
    clientInfoTitle: {
        en: "Organization Information",
        fr: "Informations de l'organisation"
    },

    // Labels
    labelName: {
        en: "Organization Name",
        fr: "Nom de l'organisation"
    },
    labelPlan: {
        en: "Current Plan",
        fr: "Plan actuel"
    },
    labelCreatedAt: {
        en: "Created",
        fr: "Créé le"
    },
    labelUpdatedAt: {
        en: "Last Updated",
        fr: "Dernière mise à jour"
    },

    // Values
    noPlan: {
        en: "No plan",
        fr: "Aucun plan"
    }
} as const;

export type ClientAdminFeatureTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ClientAdminFeature",
    translations
);

export const clientAdminFeatureConfig = config;
export const useClientAdminFeatureTranslations = useTranslations;
export default config;