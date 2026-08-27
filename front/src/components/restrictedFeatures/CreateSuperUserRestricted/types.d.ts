/**
 * CreateSuperUserRestricted props
 */
export interface CreateSuperUserRestrictedProps {
    /**
     * Optional callback called after successful creation
     */
    onCompleted?: (response: any) => void;
}

/**
 * CreateSuperUserRestricted ref interface
 */
export interface CreateSuperUserRestrictedRefInterface {
    /**
     * Whether the user has permission to create super users
     */
    hasPermission: boolean;
}
