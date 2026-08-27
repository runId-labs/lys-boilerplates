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
        en: "Personal information updated successfully",
        fr: "Informations personnelles mises à jour avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateSuperUserPrivateDataRestricted",
    translations
);

export const updateSuperUserPrivateDataRestrictedConfig = config;
export const useUpdateSuperUserPrivateDataRestrictedTranslations = useTranslations;
export default config;