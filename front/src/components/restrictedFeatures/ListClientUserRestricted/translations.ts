import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Search & Filter
    quickSearchPlaceholder: {
        en: "Search client users by name or email...",
        fr: "Rechercher par nom ou email..."
    },
    filterRole: {
        en: "Role",
        fr: "Rôle"
    },
    filterClient: {
        en: "Client",
        fr: "Client"
    },
    filterLicense: {
        en: "License",
        fr: "Licence"
    },
    filterLicensed: {
        en: "Licensed",
        fr: "Licencié"
    },
    filterNotLicensed: {
        en: "Not licensed",
        fr: "Non licencié"
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
    sortByLastName: {
        en: "Last Name",
        fr: "Nom de famille"
    },
    nameColumn: {
        en: "Name",
        fr: "Nom"
    },
    emailColumn: {
        en: "Email",
        fr: "Email"
    },
    clientColumn: {
        en: "Client",
        fr: "Client"
    },
    rolesColumn: {
        en: "Roles",
        fr: "Rôles"
    },
    createdAtColumn: {
        en: "Created",
        fr: "Créé le"
    },
    actionsColumn: {
        en: "Actions",
        fr: "Actions"
    },
    statusColumn: {
        en: "Status",
        fr: "Statut"
    },

    // User status translations
    statusActive: {
        en: "Active",
        fr: "Actif"
    },
    statusInactive: {
        en: "Inactive",
        fr: "Inactif"
    },
    statusPending: {
        en: "Pending",
        fr: "En attente"
    },
    statusSuspended: {
        en: "Suspended",
        fr: "Suspendu"
    },
    statusUnknown: {
        en: "Unknown",
        fr: "Inconnu"
    },

    // Page metadata
    pageTitle: {
        en: "Client Users",
        fr: "Utilisateurs clients"
    },
    pageDescription: {
        en: "Manage client user accounts",
        fr: "Gérer les comptes utilisateurs clients"
    },

    // Table states
    noData: {
        en: "No client users found",
        fr: "Aucun utilisateur client trouvé"
    },
    loading: {
        en: "Loading...",
        fr: "Chargement..."
    },
    noPermission: {
        en: "You don't have permission to view client users",
        fr: "Vous n'avez pas la permission de voir les utilisateurs clients"
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
    },

    // Actions
    viewAction: {
        en: "View details",
        fr: "Voir détails"
    },
    addLicenseAction: {
        en: "Add license",
        fr: "Ajouter une licence"
    },
    removeLicenseAction: {
        en: "Remove license",
        fr: "Retirer la licence"
    }
} as const;

export type ListClientUserTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ListClientUserRestricted",
    translations
);

export const listClientUserRestrictedConfig = config;
export const useListClientUserRestrictedTranslations = useTranslations;
export default config;
