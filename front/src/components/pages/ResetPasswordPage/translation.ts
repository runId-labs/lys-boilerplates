import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    pageName: {
        en: "Reset Password",
        fr: "Reinitialisation du mot de passe"
    },
    title: {
        en: "Reset your password",
        fr: "Reinitialiser votre mot de passe"
    },
    newPassword: {
        en: "New password",
        fr: "Nouveau mot de passe"
    },
    submit: {
        en: "Reset password",
        fr: "Reinitialiser"
    },
    successMessage: {
        en: "Password reset successfully! You can now log in.",
        fr: "Mot de passe reinitialise avec succès ! Vous pouvez maintenant vous connecter."
    },
    missingToken: {
        en: "Missing reset token",
        fr: "Jeton de reinitialisation manquant"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ResetPasswordPage",
    translations
);

export const useResetPasswordPageTranslations = useTranslations;
export default config.translation;