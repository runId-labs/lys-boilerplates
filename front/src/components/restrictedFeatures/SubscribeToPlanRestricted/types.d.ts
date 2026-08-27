import {ReactNode} from "react";

/**
 * Billing period for subscription
 */
export type BillingPeriod = "MONTHLY" | "YEARLY";

/**
 * Result of subscribe to plan operation
 */
export interface SubscribeToPlanResult {
    success: boolean;
    checkoutUrl?: string | null;
    effectiveDate?: string | null;
    prorataAmount?: number | null;
    error?: string | null;
}

/**
 * SubscribeToPlanRestricted props
 */
export interface SubscribeToPlanRestrictedProps {
    /**
     * Plan version ID to subscribe to
     */
    planVersionId: string;

    /**
     * Billing period
     */
    billingPeriod: BillingPeriod;

    /**
     * Commitment the plan is subscribed at, "NO_COMMITMENT" when the client is
     * bound to nothing. The couple periodicity + commitment is what identifies
     * the price the checkout is opened for.
     */
    commitmentId: string;

    /**
     * Custom render function for the trigger element
     * Receives the onClick handler and loading state
     */
    renderTrigger?: (onClick: () => void, isLoading: boolean) => ReactNode;

    /**
     * Button text (if not using renderTrigger)
     */
    buttonText?: string;

    /**
     * Callback on success
     * - checkoutUrl: redirect to payment page (new subscription or upgrade)
     * - effectiveDate: change scheduled for later (downgrade)
     */
    onSuccess?: (result: SubscribeToPlanResult) => void;

    /**
     * Callback on error
     */
    onError?: (error: string) => void;
}