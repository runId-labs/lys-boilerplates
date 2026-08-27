import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Search configuration
    quickSearchPlaceholder: {
        en: "Search super users by name or email...",
        fr: "Rechercher par nom ou email..."
    },

    // Sort options
    sortByDateCreated: {
        en: "Date Created",
        fr: "Date de création"
    },
    sortByEmailAddress: {
        en: "Email",
        fr: "Email"
    },
    sortByFirstName: {
        en: "First Name",
        fr: "Prénom"
    },
    sortByLastName: {
        en: "Last Name",
        fr: "Nom"
    },

    // Table columns
    emailColumn: {
        en: "Email",
        fr: "Email"
    },
    nameColumn: {
        en: "Name",
        fr: "Nom"
    },
    statusColumn: {
        en: "Status",
        fr: "Statut"
    },
    createdAtColumn: {
        en: "Created",
        fr: "Créé le"
    },
    actionsColumn: {
        en: "Actions",
        fr: "Actions"
    },

    // User status labels
    statusActive: {
        en: "Active",
        fr: "Actif"
    },
    statusInactive: {
        en: "Inactive",
        fr: "Inactif"
    },
    statusRevoked: {
        en: "Revoked",
        fr: "Révoqué"
    },
    statusDeleted: {
        en: "Deleted",
        fr: "Supprimé"
    },
    statusUnknown: {
        en: "Unknown",
        fr: "Inconnu"
    },

    // Pagination
    itemsPerPage: {
        en: "Items per page:",
        fr: "Éléments par page :"
    },
    showingRange: {
        en: "Showing {start}-{end} of {total}",
        fr: "Affichage de {start}-{end} sur {total}"
    },
    previous: {
        en: "Previous",
        fr: "Précédent"
    },
    next: {
        en: "Next",
        fr: "Suivant"
    },

    // UI states
    loading: {
        en: "Loading...",
        fr: "Chargement..."
    },
    noPermission: {
        en: "You do not have permission to view super users.",
        fr: "Vous n'avez pas la permission de voir les super utilisateurs."
    },
    noData: {
        en: "No super users found",
        fr: "Aucun super utilisateur trouvé"
    },

    // Actions
    actionView: {
        en: "View super user",
        fr: "Voir le super utilisateur"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ListSuperUserRestricted",
    translations
);

export const listSuperUserRestrictedConfig = config;
export const useListSuperUserRestrictedTranslations = useTranslations;
export type ListSuperUserTranslationKey = keyof typeof translations;
export default config;