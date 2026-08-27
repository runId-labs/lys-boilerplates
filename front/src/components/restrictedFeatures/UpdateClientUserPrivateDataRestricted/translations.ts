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
    "UpdateClientUserPrivateDataRestricted",
    translations
);

export const updateClientUserPrivateDataRestrictedConfig = config;
export const useUpdateClientUserPrivateDataRestrictedTranslations = useTranslations;
export default config;
