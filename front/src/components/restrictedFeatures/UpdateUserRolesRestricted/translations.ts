import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "User Roles",
        fr: "Rôles utilisateur"
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
        en: "User roles updated successfully",
        fr: "Rôles utilisateur mis à jour avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateUserRolesRestricted",
    translations
);

export const updateUserRolesRestrictedConfig = config;
export const useUpdateUserRolesRestrictedTranslations = useTranslations;