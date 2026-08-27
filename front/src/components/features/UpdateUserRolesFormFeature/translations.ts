import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    rolesLabel: {
        en: "Roles",
        fr: "Rôles"
    },
    submit: {
        en: "Save Roles",
        fr: "Enregistrer les rôles"
    },
    noRoles: {
        en: "No roles assigned",
        fr: "Aucun rôle assigné"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UpdateUserRolesFormFeature",
    translations
);

export const updateUserRolesFormFeatureConfig = config;
export const useUpdateUserRolesFormFeatureTranslations = useTranslations;