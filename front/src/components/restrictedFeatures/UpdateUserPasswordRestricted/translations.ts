import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Password",
        fr: "Mot de passe"
    },
    successMessage: {
        en: "Password updated successfully.",
        fr: "Mot de passe mis à jour avec succès."
    },
    description: {
        en: "Choose a strong password to protect your account.",
        fr: "Choisissez un mot de passe fort pour protéger votre compte."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateUserPasswordRestricted",
    translations
);

export const updateUserPasswordRestrictedConfig = config;
export const useUpdateUserPasswordRestrictedTranslations = useTranslations;
export default config;