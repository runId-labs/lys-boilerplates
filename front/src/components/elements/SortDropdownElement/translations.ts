import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    sortFieldAriaLabel: {
        en: "Sort field",
        fr: "Champ de tri"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SortDropdownElement",
    translations
);

export const sortDropdownElementConfig = config;
export const useSortDropdownElementTranslations = useTranslations;
export default config;
