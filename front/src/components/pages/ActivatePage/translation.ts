import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    pageName: {
        en: "Activate Account",
        fr: "Activation du compte"
    },
    title: {
        en: "Activate your account",
        fr: "Activer votre compte"
    },
    subtitle: {
        en: "Set your password to complete your account activation",
        fr: "Definissez votre mot de passe pour finaliser l'activation de votre compte"
    },
    newPassword: {
        en: "Password",
        fr: "Mot de passe"
    },
    submit: {
        en: "Activate my account",
        fr: "Activer mon compte"
    },
    successMessage: {
        en: "Account activated successfully! You can now log in.",
        fr: "Compte active avec succès ! Vous pouvez maintenant vous connecter."
    },
    missingToken: {
        en: "Missing activation token",
        fr: "Jeton d'activation manquant"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ActivatePage",
    translations
);

export const useActivatePageTranslations = useTranslations;
export default config.translation;