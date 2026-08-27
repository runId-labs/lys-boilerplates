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
    clientColumn: {
        en: "Client",
        fr: "Client"
    },
    statusColumn: {
        en: "Status",
        fr: "Statut"
    },
    rolesColumn: {
        en: "Roles",
        fr: "Rôles"
    },
    isLicensedColumn: {
        en: "License",
        fr: "Licence"
    },
    licensed: {
        en: "Licensed",
        fr: "Licencié"
    },
    notLicensed: {
        en: "Not licensed",
        fr: "Non licencié"
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
        en: "No client users found",
        fr: "Aucun utilisateur client trouvé"
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
    "ListClientUserFeature",
    translations
);

export const listClientUserFeatureConfig = config;
export const useListClientUserFeatureTranslations = useTranslations;
export default config;