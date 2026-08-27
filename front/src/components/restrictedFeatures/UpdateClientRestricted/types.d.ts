import {ReactNode} from "react";

/**
 * UpdateClientRestricted props
 */
export interface UpdateClientRestrictedProps {
    /**
     * Client ID to update
     */
    clientId: string;

    /**
     * Current client name
     */
    currentName: string;

    /**
     * Optional footer content
     */
    footer?: ReactNode;

    /**
     * Callback when update is completed
     */
    onCompleted?: (data: any) => void;
}

/**
 * UpdateClientRestricted ref interface
 */
export interface UpdateClientRestrictedRefInterface {
    /**
     * Whether the user has permission to update client
     */
    hasPermission: boolean;
}