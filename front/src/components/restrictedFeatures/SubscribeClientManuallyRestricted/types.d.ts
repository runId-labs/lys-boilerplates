/**
 * The subscription as it stands before the change
 */
export interface CurrentSubscription {
    /**
     * Plan code of the version subscribed to
     */
    planCode: string | null;

    /**
     * Version number subscribed to
     */
    version: number | null;

    /**
     * Whether that version is still on sale
     */
    versionEnabled: boolean;

    /**
     * Price paid, already formatted with its periodicity and commitment
     */
    price: string | null;

    /**
     * End of the commitment, null when not committed
     */
    commitmentEndDate: string | null;
}

/**
 * SubscribeClientManuallyRestricted props
 */
export interface SubscribeClientManuallyRestrictedProps {
    /**
     * Subscription GlobalID of the client
     */
    subscriptionId: string;

    /**
     * Client GlobalID, used to read what the client has already signed
     */
    clientId: string;

    /**
     * What the client is on today, shown before the choice
     */
    current?: CurrentSubscription;

    /**
     * Whether to display the button (default: true)
     * Set to false to control opening programmatically via ref
     */
    display?: boolean;

    /**
     * Callback when the subscription changed successfully
     */
    onUpdated?: () => void;
}

/**
 * SubscribeClientManuallyRestricted ref interface
 */
export interface SubscribeClientManuallyRestrictedRefInterface {
    /**
     * Whether user has permission to subscribe a client manually
     */
    hasPermission: boolean;

    /**
     * Open the subscription dialog programmatically
     */
    open: () => void;
}
