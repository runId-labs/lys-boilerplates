import {SearchFilterConfig} from "@/components/features/SearchFilterFeature/types";

/**
 * Translation function type (compatible with typed translation hooks)
 */
type TranslationFunction = (key: any, values?: Record<string, string | number>) => string;

/**
 * Search filter configuration for super user list
 * Returns translated configuration using the provided translation function
 */
export const getSuperUserListSearchFilterConfig = (t: TranslationFunction): SearchFilterConfig => ({
    // Quick search enabled
    enableQuickSearch: true,
    quickSearchPlaceholder: t("quickSearchPlaceholder"),
    quickSearchDebounce: 400,

    // Sort options (mapping to UserNodeOderByType from GraphQL schema)
    sortOptions: [
        {key: "createdAt", label: t("sortByDateCreated")},
        {key: "emailAddress", label: t("sortByEmailAddress")},
        {key: "firstName", label: t("sortByFirstName")},
        {key: "lastName", label: t("sortByLastName")}
    ],
    defaultSort: "createdAt",
    defaultSortDirection: "DESC",

    // No advanced filters for super users
    filterSections: []
});