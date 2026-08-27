import {ReactNode} from "react";

/**
 * Props for UpdateClientUserRolesRestricted component
 */
export interface UpdateClientUserRolesRestrictedProps {
    /**
     * Client user ID
     */
    clientUserId: string;

    /**
     * Current role codes assigned to the user
     */
    roleCodes: string[];

    /**
     * Optional footer content for the card
     */
    footer?: ReactNode;

    /**
     * Callback when mutation completes successfully
     */
    onCompleted?: (data: any) => void;
}

/**
 * Ref interface for UpdateClientUserRolesRestricted
 */
export interface UpdateClientUserRolesRestrictedRefInterface {
    hasPermission: boolean;
}
