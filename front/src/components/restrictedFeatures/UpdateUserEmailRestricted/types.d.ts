import {ReactNode} from "react";
import {HasPermissionRefInterface} from "lys-front/providers";

/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * UpdateUserEmailRestricted props
 */
export interface UpdateUserEmailRestrictedProps {
    /**
     * User ID
     */
    userId: string;

    /**
     * Access parameters for OWNER permission checking
     */
    accessParameters?: AccessParameters | null;

    /**
     * Current email address
     */
    currentEmail: string;

    /**
     * Email validation date
     */
    validatedAt?: string | null;

    /**
     * Last validation request date
     */
    lastValidationRequestAt?: string | null;

    /**
     * Optional custom footer content to display below the form
     */
    footer?: ReactNode;

    /**
     * Optional callback called after successful mutation
     */
    onCompleted?: (response: any) => void;
}

/**
 * UpdateUserEmailRestricted ref interface
 */
export type UpdateUserEmailRestrictedRefInterface = HasPermissionRefInterface;