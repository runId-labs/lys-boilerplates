import {ReactNode} from "react";

/**
 * Props for UpdateClientUserEmailRestricted component
 */
export interface UpdateClientUserEmailRestrictedProps {
    /**
     * Client user ID
     */
    clientUserId: string;

    /**
     * Current email address
     */
    currentEmail: string;

    /**
     * Date when email was validated
     */
    validatedAt?: string | null;

    /**
     * Date of last validation request
     */
    lastValidationRequestAt?: string | null;

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
 * Ref interface for UpdateClientUserEmailRestricted
 */
export interface UpdateClientUserEmailRestrictedRefInterface {
    hasPermission: boolean;
}
