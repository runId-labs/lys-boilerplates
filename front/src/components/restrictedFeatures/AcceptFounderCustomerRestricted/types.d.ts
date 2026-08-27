/**
 * AcceptFounderCustomerRestricted props
 */
export interface AcceptFounderCustomerRestrictedProps {
    /**
     * Called when the client ticks or unticks the programme
     */
    onChange?: (accepted: boolean) => void;
}

/**
 * Ref interface exposing the acceptance to the parent
 */
export interface AcceptFounderCustomerRestrictedRefInterface {
    /**
     * Whether the client ticked the programme
     */
    accepted: boolean;

    /**
     * Record the acceptance of the current version, and resolve to whether the
     * proof was written. Returns true when nothing was ticked: there is then
     * nothing to record, and the caller has no reason to stop.
     */
    accept: () => Promise<boolean>;
}
