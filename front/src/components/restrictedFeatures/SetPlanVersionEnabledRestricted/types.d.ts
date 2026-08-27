/**
 * SetPlanVersionEnabledRestricted props
 */
export interface SetPlanVersionEnabledRestrictedProps {
    /**
     * Plan version GlobalID
     */
    planVersionId: string;

    /**
     * Whether the version is currently available for new subscriptions
     */
    enabled: boolean;

    /**
     * Whether to display the button (default: true)
     * Set to false to control opening programmatically via ref
     */
    display?: boolean;

    /**
     * Callback when the availability changed successfully
     */
    onUpdated?: () => void;
}

/**
 * SetPlanVersionEnabledRestricted ref interface
 */
export interface SetPlanVersionEnabledRestrictedRefInterface {
    /**
     * Whether user has permission to change a plan version availability
     */
    hasPermission: boolean;

    /**
     * Open the availability dialog programmatically
     */
    open: () => void;
}
