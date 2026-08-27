import {SearchFilterConfig} from "@/components/features/SearchFilterFeature/types";
import SelectLicensePlanRestricted from "@/components/restrictedFeatures/SelectLicensePlanRestricted";

/**
 * Translation function type (compatible with typed translation hooks)
 */
type TranslationFunction = (key: any, values?: Record<string, string | number>) => string;

/**
 * Search filter configuration for the plan version list
 *
 * The webservice exposes no text search: it filters on plan and availability
 * only, so quick search stays off.
 */
export const getPlanVersionListSearchFilterConfig = (t: TranslationFunction): SearchFilterConfig => ({
    // Sort options
    sortOptions: [
        {key: "createdAt", label: t("sortByDateCreated")}
    ],
    defaultSort: "createdAt",
    defaultSortDirection: "DESC",

    // Advanced filter sections
    filterSections: [
        {
            uniqueKey: "filters-section",
            controls: [
                {
                    valueKey: "planId",
                    label: t("filterPlan"),
                    type: "custom",
                    customComponent: SelectLicensePlanRestricted,
                    customProps: {
                        nullable: true,
                        isFloatingLabel: true
                    },
                    xs: 12
                },
                {
                    valueKey: "enabled",
                    label: t("filterEnabled"),
                    type: "select",
                    nullable: true,
                    isFloatingLabel: true,
                    options: [
                        {value: "true", label: t("filterEnabledTrue")},
                        {value: "false", label: t("filterEnabledFalse")}
                    ],
                    xs: 12
                }
            ]
        }
    ]
});
