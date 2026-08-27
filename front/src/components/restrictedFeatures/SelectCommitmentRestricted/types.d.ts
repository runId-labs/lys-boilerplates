/**
 * A commitment the offer is actually sold against
 */
export interface CommitmentOption {
    /**
     * Commitment code, the identifier the subscription mutations expect
     */
    code: string;

    /**
     * Duration the client is bound for, used to order the options
     */
    durationMonths: number;
}

/**
 * SelectCommitmentRestricted props
 */
export interface SelectCommitmentRestrictedProps {
    /**
     * Currently selected commitment code
     */
    value: string | null;

    /**
     * Called when the client picks another commitment, and once on load with
     * the shortest one so that a price is always displayed
     */
    onChange: (commitmentCode: string) => void;
}
