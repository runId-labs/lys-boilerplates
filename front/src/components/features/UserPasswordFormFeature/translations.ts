import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    currentPassword: {
        en: "Current Password",
        fr: "Mot de passe actuel"
    },
    newPassword: {
        en: "New Password",
        fr: "Nouveau mot de passe"
    },
    confirmPassword: {
        en: "Confirm New Password",
        fr: "Confirmer le nouveau mot de passe"
    },
    submit: {
        en: "Update Password",
        fr: "Mettre à jour le mot de passe"
    },
    passwordError: {
        en: "Password is required",
        fr: "Le mot de passe est requis"
    },
    confirmPasswordError: {
        en: "Passwords do not match",
        fr: "Les mots de passe ne correspondent pas"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UserPasswordFormFeature",
    translations
);

export const userPasswordFormFeatureConfig = config;
export const useUserPasswordFormFeatureTranslations = useTranslations;