import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Personal Information",
        fr: "Informations personnelles"
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
        en: "Personal information updated successfully.",
        fr: "Informations personnelles mises à jour avec succès."
    },
    description: {
        en: "Update your personal details to keep your profile current.",
        fr: "Mettez à jour vos informations personnelles pour maintenir votre profil à jour."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateUserPrivateDataRestricted",
    translations
);

export const updateUserPrivateDataRestrictedConfig = config;
export const useUpdateUserPrivateDataRestrictedTranslations = useTranslations;
export default config;
