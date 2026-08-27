import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Email Address",
        fr: "Adresse email"
    },
    edit: {
        en: "Edit",
        fr: "Modifier"
    },
    cancel: {
        en: "Cancel",
        fr: "Annuler"
    },
    successMessage: {
        en: "Email address updated successfully",
        fr: "Adresse email mise à jour avec succès"
    },
    validated: {
        en: "Validated on",
        fr: "Validé le"
    },
    notValidated: {
        en: "Email not validated",
        fr: "Email non validé"
    },
    lastRequest: {
        en: "Last validation request",
        fr: "Dernière demande de validation"
    },
    description: {
        en: "An email will be sent to the new address",
        fr: "Un email sera envoyé à la nouvelle adresse"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateClientUserEmailRestricted",
    translations
);

export const updateClientUserEmailRestrictedConfig = config;
export const useUpdateClientUserEmailRestrictedTranslations = useTranslations;
export default config;
