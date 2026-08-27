import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    quickSearchAriaLabel: {
        en: "Quick search",
        fr: "Recherche rapide"
    },
    clearSearchAriaLabel: {
        en: "Clear search",
        fr: "Effacer la recherche"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "QuickSearchInputElement",
    translations
);

export const quickSearchInputElementConfig = config;
export const useQuickSearchInputElementTranslations = useTranslations;
export default config;
