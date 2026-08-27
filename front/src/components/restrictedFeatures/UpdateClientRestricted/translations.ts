import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Card
    title: {
        en: "Client Information",
        fr: "Information client"
    },

    // Form labels
    labelName: {
        en: "Name",
        fr: "Nom"
    },

    // Buttons
    edit: {
        en: "Edit",
        fr: "Modifier"
    },
    cancel: {
        en: "Cancel",
        fr: "Annuler"
    },
    save: {
        en: "Save",
        fr: "Enregistrer"
    },

    // Messages
    successMessage: {
        en: "Client updated successfully",
        fr: "Client mis à jour avec succès"
    },

    // Validation
    nameRequired: {
        en: "Name is required",
        fr: "Le nom est requis"
    }
} as const;

export type UpdateClientTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "UpdateClientRestricted",
    translations
);

export const updateClientRestrictedConfig = config;
export const useUpdateClientRestrictedTranslations = useTranslations;
export default config;