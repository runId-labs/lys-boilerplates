import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Role",
        fr: "Rôle"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectRoleRestricted",
    translations
);

export const selectRoleRestrictedConfig = config;
export const useSelectRoleRestrictedTranslations = useTranslations;