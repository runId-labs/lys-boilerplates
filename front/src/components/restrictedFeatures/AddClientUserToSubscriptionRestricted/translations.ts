import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    buttonText: {
        en: "Add license",
        fr: "Ajouter une licence"
    },
    confirmTitle: {
        en: "Add license",
        fr: "Ajouter une licence"
    },
    confirmMessage: {
        en: "Are you sure you want to add a license to this user?",
        fr: "Êtes-vous sûr de vouloir ajouter une licence à cet utilisateur ?"
    },
    confirmButton: {
        en: "Add",
        fr: "Ajouter"
    },
    cancelButton: {
        en: "Cancel",
        fr: "Annuler"
    },
    successMessage: {
        en: "License added successfully",
        fr: "Licence ajoutée avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "AddClientUserToSubscriptionRestricted",
    translations
);

export const addClientUserToSubscriptionRestrictedConfig = config;
export const useAddClientUserToSubscriptionRestrictedTranslations = useTranslations;
export default config;