/**
 * CreateUserRestricted props
 */
export interface CreateUserRestrictedProps {
    /**
     * Optional callback called after successful creation
     */
    onCompleted?: (response: any) => void;
}

/**
 * CreateUserRestricted ref interface
 */
export interface CreateUserRestrictedRefInterface {
    /**
     * Whether the user has permission to create users
     */
    hasPermission: boolean;
}