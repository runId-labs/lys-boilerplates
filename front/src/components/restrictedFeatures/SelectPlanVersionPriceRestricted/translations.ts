import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Price",
        fr: "Tarif"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectPlanVersionPriceRestricted",
    translations
);

export const selectPlanVersionPriceRestrictedConfig = config;
export const useSelectPlanVersionPriceRestrictedTranslations = useTranslations;
export default config;
