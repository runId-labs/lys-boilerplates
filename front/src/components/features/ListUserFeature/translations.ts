import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Table columns
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

    // User status translations
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

export type ListUserFeatureTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ListUserFeature",
    translations
);

export const listUserFeatureConfig = config;
export const useListUserFeatureTranslations = useTranslations;
export default config;