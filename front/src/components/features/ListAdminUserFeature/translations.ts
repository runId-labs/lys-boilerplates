import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
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

    // User status
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

    // Table states
    noData: {
        en: "No users found",
        fr: "Aucun utilisateur trouvé"
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

const {config, useTranslations} = createComponentTranslations(
    "ListAdminUserFeature",
    translations
);

export const listAdminUserFeatureConfig = config;
export const useListAdminUserFeatureTranslations = useTranslations;
export default config;