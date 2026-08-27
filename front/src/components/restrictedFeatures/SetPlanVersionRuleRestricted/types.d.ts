/**
 * A quota already set on the plan version
 */
export interface PlanVersionRule {
    /**
     * Rule identifier (e.g. "MAX_COMPANIES")
     */
    ruleCode: string;

    /**
     * Current limit, null meaning unlimited
     */
    limitValue: number | null;
}

/**
 * SetPlanVersionRuleRestricted props
 */
export interface SetPlanVersionRuleRestrictedProps {
    /**
     * Plan version GlobalID
     */
    planVersionId: string;

    /**
     * Quotas already set on the version, used to pre-fill the dialog
     */
    rules?: PlanVersionRule[];

    /**
     * Whether to display the button (default: true)
     * Set to false to control opening programmatically via ref
     */
    display?: boolean;

    /**
     * Callback when the quotas are set successfully
     */
    onUpdated?: () => void;
}

/**
 * SetPlanVersionRuleRestricted ref interface
 */
export interface SetPlanVersionRuleRestrictedRefInterface {
    /**
     * Whether user has permission to set a quota on a plan version
     */
    hasPermission: boolean;

    /**
     * Open the quota dialog programmatically
     */
    open: () => void;
}
