import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    noImports: {
        en: "No imports",
        fr: "Aucun import"
    },
    loadMore: {
        en: "Load more",
        fr: "Voir plus"
    },
    pending: {
        en: "Pending",
        fr: "En attente"
    },
    processing: {
        en: "Processing",
        fr: "En cours"
    },
    completed: {
        en: "Completed",
        fr: "Terminé"
    },
    failed: {
        en: "Failed",
        fr: "Échoué"
    },
    cancelled: {
        en: "Cancelled",
        fr: "Annulé"
    },
    rows: {
        en: "{success}/{total} rows",
        fr: "{success}/{total} lignes"
    },
    errors: {
        en: "{count} error(s)",
        fr: "{count} erreur(s)"
    },
    // Add one key per backend import type here and map it via the typeLabelKeys
    // prop (e.g. invoiceImport: {en: "Invoice", fr: "Facture"}).
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ImportListRestricted",
    translations
);

export const importListRestrictedConfig = config;
export const useImportListRestrictedTranslations = useTranslations;
export default config;
