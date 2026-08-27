import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Discount",
        fr: "Remise"
    },
    none: {
        en: "No discount",
        fr: "Aucune remise"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectDiscountRestricted",
    translations
);

export const selectDiscountRestrictedConfig = config;
export const useSelectDiscountRestrictedTranslations = useTranslations;
export default config;
