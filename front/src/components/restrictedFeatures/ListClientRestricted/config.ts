import {SearchFilterConfig} from "@/components/features/SearchFilterFeature/types";

/**
 * Translation function type (compatible with typed translation hooks)
 */
type TranslationFunction = (key: any, values?: Record<string, string | number>) => string;

/**
 * Search filter configuration for client list
 * Returns translated configuration using the provided translation function
 */
export const getClientListSearchFilterConfig = (t: TranslationFunction): SearchFilterConfig => ({
    // Quick search enabled
    enableQuickSearch: true,
    quickSearchPlaceholder: t("quickSearchPlaceholder"),
    quickSearchDebounce: 400,

    // Sort options (mapping to ClientNodeOderByType from GraphQL schema)
    sortOptions: [
        {key: "name", label: t("sortByName")},
        {key: "createdAt", label: t("sortByDateCreated")},
        {key: "updatedAt", label: t("sortByDateUpdated")}
    ],
    defaultSort: "createdAt",
    defaultSortDirection: "DESC",

    // No advanced filters for now
    filterSections: []
});