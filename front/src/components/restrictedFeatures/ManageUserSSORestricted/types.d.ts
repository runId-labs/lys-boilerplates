/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * ManageUserSSORestricted props
 */
export interface ManageUserSSORestrictedProps {
    /**
     * Connected user ID, used as the SSO link owner for permission checks
     */
    userId: string;
}

/**
 * A configured SSO provider merged with the connected user's link state
 */
export interface SSOProviderLinkState {
    providerId: string;
    name: string;
    loginUrl: string;
    linkId: string | null;
    externalEmail: string | null;
    linkedAt: string | null;
}
