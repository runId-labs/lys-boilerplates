/**
 * CreateClientUserRestricted props
 */
export interface CreateClientUserRestrictedProps {
    /**
     * Optional callback called after successful creation
     */
    onCompleted?: (response: any) => void;
}

/**
 * CreateClientUserRestricted ref interface
 */
export interface CreateClientUserRestrictedRefInterface {
    /**
     * Whether the user has permission to create client users
     */
    hasPermission: boolean;
}