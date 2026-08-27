/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * UnlinkUserSSORestricted props
 */
export interface UnlinkUserSSORestrictedProps {
    /**
     * SSO link ID (GlobalID) to delete
     */
    linkId: string;

    /**
     * Provider display name, shown in the confirmation message
     */
    providerName: string;

    /**
     * Access parameters for OWNER permission checking
     */
    accessParameters?: AccessParameters | null;

    /**
     * Called with the deleted link ID after a successful unlink
     */
    onCompleted?: (linkId: string) => void;
}
