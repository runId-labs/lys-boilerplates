/**
 * Props for UpdateUserRolesRestricted component
 */
export interface UpdateUserRolesRestrictedProps {
    /**
     * User ID to update roles for
     */
    userId: string;

    /**
     * Current role codes assigned to the user
     */
    roleCodes: string[];

    /**
     * Optional footer content for the card
     */
    footer?: React.ReactNode;

    /**
     * Callback function called when mutation completes successfully
     */
    onCompleted?: (response: any) => void;
}

/**
 * Ref interface for UpdateUserRolesRestricted
 */
export interface UpdateUserRolesRestrictedRefInterface {
    /**
     * Whether the user has permission to update roles
     */
    hasPermission: boolean;
}