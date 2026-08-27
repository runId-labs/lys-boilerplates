import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Sort options
    sortByDateCreated: {
        en: "Date Created",
        fr: "Date de création"
    },

    // Filter labels
    filterPlan: {
        en: "Plan",
        fr: "Offre"
    },
    filterEnabled: {
        en: "Availability",
        fr: "Disponibilité"
    },
    filterEnabledTrue: {
        en: "Available",
        fr: "Disponible"
    },
    filterEnabledFalse: {
        en: "Retired",
        fr: "Retirée"
    },

    // Table columns
    planColumn: {
        en: "Plan",
        fr: "Offre"
    },
    versionColumn: {
        en: "Version",
        fr: "Version"
    },
    pricesColumn: {
        en: "Prices",
        fr: "Tarifs"
    },
    rulesColumn: {
        en: "Quotas",
        fr: "Quotas"
    },
    statusColumn: {
        en: "Status",
        fr: "Statut"
    },
    actionsColumn: {
        en: "Actions",
        fr: "Actions"
    },

    // Cell values
    freeVersion: {
        en: "Free",
        fr: "Gratuit"
    },
    statusEnabled: {
        en: "Available",
        fr: "Disponible"
    },
    statusDisabled: {
        en: "Retired",
        fr: "Retirée"
    },

    // Table states
    noData: {
        en: "No plan versions found",
        fr: "Aucune version d'offre trouvée"
    },
    noPermission: {
        en: "You don't have permission to view plan versions",
        fr: "Vous n'avez pas la permission de voir les versions d'offre"
    }
} as const;

export type ListPlanVersionTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ListPlanVersionRestricted",
    translations
);

export const listPlanVersionRestrictedConfig = config;
export const useListPlanVersionRestrictedTranslations = useTranslations;
export default config;
