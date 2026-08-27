/**
 * Props for CreatePlanVersionRestricted component
 */
export interface CreatePlanVersionRestrictedProps {
    /**
     * Called after a successful creation, with the created plan version
     */
    onCompleted?: (planVersion: {id: string}) => void;

    /**
     * Initial form values, to pre-fill the dialog (e.g. the plan currently used
     * as a list filter)
     */
    initParameters?: Record<string, any>;
}

/**
 * Ref interface exposed by CreatePlanVersionRestricted
 */
export interface CreatePlanVersionRestrictedRefInterface {
    /**
     * Whether the connected user may publish a plan version
     */
    hasPermission: boolean;
}
