/**
 * Props for ManageClientDropdownFeature component
 */
export interface ManageClientDropdownFeatureProps {
    /**
     * The client ID to manage
     */
    clientId: string;

    /**
     * The owner user ID of the client
     */
    ownerId: string;

    /**
     * The subscription ID if the client has one
     */
    subscriptionId: string | null;

    /**
     * What the client is subscribed to today, shown before assigning an offer
     */
    currentSubscription?: import("@/components/restrictedFeatures/SubscribeClientManuallyRestricted/types").CurrentSubscription;

    /**
     * Billing mode the subscription is on today ("MANUAL" or "PROVIDER")
     */
    billingModeCode?: string | null;

    /**
     * Whether the subscription panel offers the plan selection. That path is
     * the client's own checkout, so it stays open on the client's own
     * administration page and is closed where staff act on their behalf.
     * @default true
     */
    allowPlanChange?: boolean;

    /**
     * Called after an action changed the client, to refresh the list
     */
    onUpdated?: () => void;
}