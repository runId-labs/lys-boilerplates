import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    actions: {
        en: "Actions",
        fr: "Actions"
    },
    noData: {
        en: "No data available",
        fr: "Aucune donnée disponible"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "TableElement",
    translations
);

export const tableElementConfig = config;
export const useTableElementTranslations = useTranslations;
export default config;
