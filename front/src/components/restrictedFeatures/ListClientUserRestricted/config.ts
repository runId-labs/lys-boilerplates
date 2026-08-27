import {SearchFilterConfig} from "@/components/features/SearchFilterFeature/types";
import SelectRoleRestricted from "@/components/restrictedFeatures/SelectRoleRestricted";

/**
 * Translation function type (compatible with typed translation hooks)
 */
type TranslationFunction = (key: any, values?: Record<string, string | number>) => string;

/**
 * Search filter configuration for client user list
 * Returns translated configuration using the provided translation function
 */
export const getClientUserListSearchFilterConfig = (t: TranslationFunction): SearchFilterConfig => ({
    // Quick search enabled
    enableQuickSearch: true,
    quickSearchPlaceholder: t("quickSearchPlaceholder"),
    quickSearchDebounce: 400,

    // Sort options (mapping to UserNodeOderByType from GraphQL schema)
    sortOptions: [
        {key: "createdAt", label: t("sortByDateCreated")},
        {key: "emailAddress", label: t("sortByEmailAddress")},
        {key: "lastName", label: t("sortByLastName")}
    ],
    defaultSort: "createdAt",
    defaultSortDirection: "DESC",

    // Advanced filter sections
    filterSections: [
        {
            uniqueKey: "filters-section",
            controls: [
                {
                    valueKey: "roleCode",
                    label: t("filterRole"),
                    type: "custom",
                    customComponent: SelectRoleRestricted,
                    customProps: {
                        nullable: true,
                        isFloatingLabel: true
                    },
                    xs: 12
                },
                {
                    valueKey: "isLicensed",
                    label: t("filterLicense"),
                    type: "select",
                    nullable: true,
                    isFloatingLabel: true,
                    options: [
                        {value: "true", label: t("filterLicensed")},
                        {value: "false", label: t("filterNotLicensed")}
                    ],
                    xs: 12
                }
            ]
        }
    ]
});
