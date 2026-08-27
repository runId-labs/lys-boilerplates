/**
 * SetSubscriptionBillingModeRestricted props
 */
export interface SetSubscriptionBillingModeRestrictedProps {
    /**
     * Subscription GlobalID
     */
    subscriptionId: string;

    /**
     * Billing mode the subscription is on today ("MANUAL" or "PROVIDER")
     */
    billingModeCode: string | null;

    /**
     * Whether to display the button (default: true)
     * Set to false to control opening programmatically via ref
     */
    display?: boolean;

    /**
     * Callback when the billing mode changed successfully
     */
    onUpdated?: () => void;
}

/**
 * SetSubscriptionBillingModeRestricted ref interface
 */
export interface SetSubscriptionBillingModeRestrictedRefInterface {
    /**
     * Whether user has permission to change how a subscription is collected
     */
    hasPermission: boolean;

    /**
     * Open the billing mode dialog programmatically
     */
    open: () => void;
}
