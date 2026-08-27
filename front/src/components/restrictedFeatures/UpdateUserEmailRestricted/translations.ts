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
    validated: {
        en: "Email verified on",
        fr: "Email vérifié le"
    },
    notValidated: {
        en: "Email not verified",
        fr: "Email non vérifié"
    },
    lastRequest: {
        en: "Last verification email sent on",
        fr: "Dernier email de vérification envoyé le"
    },
    successMessage: {
        en: "Email updated successfully. Please check your inbox for verification.",
        fr: "Email mis à jour avec succès. Veuillez vérifier votre boîte de réception."
    },
    description: {
        en: "You will receive a verification email at the new address.",
        fr: "Vous recevrez un email de vérification à la nouvelle adresse."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateUserEmailRestricted",
    translations
);

export const updateUserEmailRestrictedConfig = config;
export const useUpdateUserEmailRestrictedTranslations = useTranslations;