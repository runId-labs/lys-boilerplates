/**
 * AddClientUserToSubscriptionRestricted props
 */
export interface AddClientUserToSubscriptionRestrictedProps {
    /**
     * Client user ID to add to subscription
     */
    clientUserId: string;

    /**
     * Whether to display the default trigger button
     * @default true
     */
    display?: boolean;

    /**
     * Callback when the mutation completes successfully
     */
    onCompleted?: () => void;
}

/**
 * AddClientUserToSubscriptionRestricted ref interface
 */
export interface AddClientUserToSubscriptionRestrictedRefInterface {
    /**
     * Whether the user has permission to add client user to subscription
     */
    hasPermission: boolean;

    /**
     * Trigger the add to subscription action
     */
    open: () => void;
}