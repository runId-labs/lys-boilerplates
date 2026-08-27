import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    quickSearchPlaceholder: {
        en: "Search...",
        fr: "Rechercher..."
    },
    sortBy: {
        en: "Sort by",
        fr: "Trier par"
    },
    filters: {
        en: "Filters",
        fr: "Filtres"
    },
    filtersCount: {
        en: "Filters ({count})",
        fr: "Filtres ({count})"
    },
    applyFilters: {
        en: "Apply Filters",
        fr: "Appliquer les filtres"
    },
    clearAll: {
        en: "Clear all",
        fr: "Tout effacer"
    },
    activeFilters: {
        en: "Active filters:",
        fr: "Filtres actifs :"
    },
    noFilters: {
        en: "No filters applied",
        fr: "Aucun filtre appliqué"
    },
    ascending: {
        en: "Ascending",
        fr: "Croissant"
    },
    descending: {
        en: "Décroissant",
        fr: "Descending"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SearchFilterFeature",
    translations
);

export const searchFilterFeatureConfig = config;
export const useSearchFilterFeatureTranslations = useTranslations;
export default config;
