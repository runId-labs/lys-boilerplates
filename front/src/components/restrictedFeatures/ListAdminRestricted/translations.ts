import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Search configuration
    quickSearchPlaceholder: {
        en: "Search admins by name or email...",
        fr: "Rechercher par nom ou email..."
    },
    filterRole: {
        en: "Role",
        fr: "Rôle"
    },

    // Sort options & Table columns
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
    columnStatus: {
        en: "Status",
        fr: "Statut"
    },
    columnRoles: {
        en: "Roles",
        fr: "Rôles"
    },
    columnActions: {
        en: "Actions",
        fr: "Actions"
    },

    // Row actions
    actionView: {
        en: "View",
        fr: "Voir"
    },
    actionEdit: {
        en: "Edit",
        fr: "Modifier"
    },
    actionDelete: {
        en: "Delete",
        fr: "Supprimer"
    },

    // User status labels
    statusEnabled: {
        en: "Enabled",
        fr: "Activé"
    },
    statusDisabled: {
        en: "Disabled",
        fr: "Désactivé"
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
        en: "You do not have permission to view users.",
        fr: "Vous n'avez pas la permission de voir les utilisateurs."
    },
    noData: {
        en: "No users found",
        fr: "Aucun utilisateur trouvé"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ListAdminRestricted",
    translations
);

export const listAdminRestrictedConfig = config;
export const useListAdminRestrictedTranslations = useTranslations;
export type ListAdminTranslationKey = keyof typeof translations;
export default config;
