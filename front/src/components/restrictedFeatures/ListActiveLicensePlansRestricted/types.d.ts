/**
 * Price of a plan version for one periodicity, currency and commitment
 */
export interface PlanVersionPrice {
    readonly id: string;
    readonly amount: number;
    readonly period: {
        readonly code: string;
    };
    readonly currency: {
        readonly code: string;
        readonly minorUnit: number;
    };
    readonly commitment: {
        readonly code: string;
        readonly durationMonths: number;
    };
}

/**
 * Selected plan details passed to onSelectPlan callback
 */
export interface SelectedPlanDetails {
    planVersionId: string;

    /**
     * Price the plan was selected at, null for the free plan
     */
    planVersionPriceId: string | null;

    billingPeriod: string;

    /**
     * Commitment the plan was selected at, "NO_COMMITMENT" for the free plan
     */
    commitmentId: string;

    planCode: string;
    planName: string;
    price: string;
    isFree: boolean;
}

/**
 * ListActiveLicensePlansRestricted props
 */
export interface ListActiveLicensePlansRestrictedProps {
    /**
     * Current subscription plan version ID (to highlight current plan)
     */
    currentPlanVersionId?: string | null;

    /**
     * Callback when a plan is selected for checkout
     */
    onSelectPlan?: (details: SelectedPlanDetails) => void;
}
