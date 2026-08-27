import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Roles",
        fr: "Rôles"
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
        en: "Roles updated successfully",
        fr: "Rôles mis à jour avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateClientUserRolesRestricted",
    translations
);

export const updateClientUserRolesRestrictedConfig = config;
export const useUpdateClientUserRolesRestrictedTranslations = useTranslations;
export default config;
