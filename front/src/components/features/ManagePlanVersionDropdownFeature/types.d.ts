/**
 * Props for ManagePlanVersionDropdownFeature component
 */
export interface ManagePlanVersionDropdownFeatureProps {
    /**
     * Plan version the menu acts on
     */
    planVersionId: string;

    /**
     * Whether the version is currently available for new subscriptions
     */
    enabled: boolean;

    /**
     * Quotas already set on the version, pre-filling the quota dialog
     */
    rules?: {ruleCode: string; limitValue: number | null}[];

    /**
     * Called after an action changed the plan version, to refresh the list
     */
    onUpdated?: () => void;
}
