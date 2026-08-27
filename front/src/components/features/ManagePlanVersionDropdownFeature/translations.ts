import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    menuSetRule: {
        en: "Set a quota",
        fr: "Définir un quota"
    },
    menuRetire: {
        en: "Retire this version",
        fr: "Retirer cette version"
    },
    menuPutOnSale: {
        en: "Put back on sale",
        fr: "Remettre en vente"
    }
} as const;

export type ManagePlanVersionDropdownTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ManagePlanVersionDropdownFeature",
    translations
);

export const managePlanVersionDropdownFeatureConfig = config;
export const useManagePlanVersionDropdownFeatureTranslations = useTranslations;
export default config;
