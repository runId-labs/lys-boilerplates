import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Plan",
        fr: "Offre"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectLicensePlanRestricted",
    translations
);

export const selectLicensePlanRestrictedConfig = config;
export const useSelectLicensePlanRestrictedTranslations = useTranslations;
export default config;
