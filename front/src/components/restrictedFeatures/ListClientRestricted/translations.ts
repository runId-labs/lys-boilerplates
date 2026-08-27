import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Search & Filter
    quickSearchPlaceholder: {
        en: "Search clients by name...",
        fr: "Rechercher par nom..."
    },

    // Sort options & Table columns
    sortByName: {
        en: "Name",
        fr: "Nom"
    },
    sortByDateCreated: {
        en: "Date Created",
        fr: "Date de création"
    },
    sortByDateUpdated: {
        en: "Date Updated",
        fr: "Date de mise à jour"
    },
    nameColumn: {
        en: "Name",
        fr: "Nom"
    },
    licensePlanColumn: {
        en: "License Type",
        fr: "Type de licence"
    },
    billingModeColumn: {
        en: "Billing",
        fr: "Facturation"
    },
    createdAtColumn: {
        en: "Created",
        fr: "Créé le"
    },
    updatedAtColumn: {
        en: "Updated",
        fr: "Mis à jour le"
    },
    actionsColumn: {
        en: "Actions",
        fr: "Actions"
    },

    // Table states
    noData: {
        en: "No clients found",
        fr: "Aucun client trouvé"
    },
    loading: {
        en: "Loading...",
        fr: "Chargement..."
    },
    noPermission: {
        en: "You don't have permission to view clients",
        fr: "Vous n'avez pas la permission de voir les clients"
    },

    // Pagination
    itemsPerPage: {
        en: "Items per page",
        fr: "Éléments par page"
    },
    showingRange: {
        en: "Showing {start} to {end} of {total}",
        fr: "Affichage de {start} à {end} sur {total}"
    },
    previous: {
        en: "Previous",
        fr: "Précédent"
    },
    next: {
        en: "Next",
        fr: "Suivant"
    }
} as const;

export type ListClientTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ListClientRestricted",
    translations
);

export const listClientRestrictedConfig = config;
export const useListClientRestrictedTranslations = useTranslations;
export default config;