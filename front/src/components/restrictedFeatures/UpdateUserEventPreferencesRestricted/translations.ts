import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Notification Preferences",
        fr: "Préférences de notification"
    },
    description: {
        en: "Choose which notifications you want to receive by email or in the app.",
        fr: "Choisissez les notifications que vous souhaitez recevoir par email ou dans l'application."
    },
    successMessage: {
        en: "Notification preferences updated successfully.",
        fr: "Préférences de notification mises à jour avec succès."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateUserEventPreferencesRestricted",
    translations
);

export const updateUserEventPreferencesRestrictedConfig = config;
export const useUpdateUserEventPreferencesRestrictedTranslations = useTranslations;
export default config;