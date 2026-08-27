import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    dropZoneLabel: {
        en: "Drag and drop your documents here",
        fr: "Glissez vos documents ici"
    },
    helperText: {
        en: "or browse your files — any type, recognised automatically",
        fr: "ou parcourez vos fichiers — tout type, reconnu automatiquement"
    },
    uploadingLabel: {
        en: "Sending your files…",
        fr: "Envoi de vos fichiers en cours…"
    },
    summaryToggleAriaLabel: {
        en: "Show or hide the file list",
        fr: "Afficher ou masquer la liste des fichiers"
    },
    summaryUploading: {
        en: "{count} in progress",
        fr: "{count} en cours"
    },
    summarySuccess: {
        en: "{count} imported",
        fr: "{count} importé(s)"
    },
    summaryWarning: {
        en: "{count} error(s) or warning(s)",
        fr: "{count} en erreur ou non reconnu(s)"
    },
    attentionFilterLabel: {
        en: "Imports requiring your attention",
        fr: "Imports nécessitant votre attention"
    },
    emptyAttentionMessage: {
        en: "No file requires your attention.",
        fr: "Aucun fichier ne nécessite votre attention."
    },
    selectedFilesAriaLabel: {
        en: "Dropped files",
        fr: "Fichiers déposés"
    },
    subfoldersIgnored: {
        en: "{count} subfolder(s) ignored — drop them separately if needed",
        fr: "{count} sous-dossier(s) ignoré(s) — dépose-les séparément si besoin"
    },
    statusUploading: {en: "Sending…", fr: "Envoi…"},
    statusSuccess: {en: "Imported", fr: "Importé"},
    statusDuplicate: {en: "Already imported", fr: "Déjà importé"},
    statusUnrecognised: {en: "Not recognised", fr: "Non reconnu"},
    statusError: {en: "Upload failed", fr: "Échec de l'envoi"}
    // Add one key per server-recognised file type here and map it via the
    // typeLabelKeys prop (e.g. typeInvoice: {en: "Invoice", fr: "Facture"}).
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UnifiedImportDropZoneFeature",
    translations
);

export const unifiedImportDropZoneFeatureConfig = config;
export const useUnifiedImportDropZoneFeatureTranslations = useTranslations;
export default config;
