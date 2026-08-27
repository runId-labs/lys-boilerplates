import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    linkText: {
        en: "Forgot password?",
        fr: "Mot de passe oublié ?"
    },
    dialogTitle: {
        en: "Reset Password",
        fr: "Réinitialiser le mot de passe"
    },
    email: {
        en: "Email",
        fr: "Email"
    },
    emailError: {
        en: "Please enter a valid email address",
        fr: "Veuillez saisir une adresse email valide"
    },
    submit: {
        en: "Send reset link",
        fr: "Envoyer le lien"
    },
    footer: {
        en: "You will receive an email with instructions to reset your password.",
        fr: "Vous recevrez un email avec les instructions pour réinitialiser votre mot de passe."
    },
    successMessage: {
        en: "Password reset email sent successfully",
        fr: "Email de réinitialisation envoyé avec succès"
    }
};

const {config, useTranslations} = createComponentTranslations(
    "RequestForgottenPasswordResetFeature",
    translations
);

export const requestForgottenPasswordResetFeatureConfig = config;
export const useRequestForgottenPasswordResetTranslations = useTranslations;
