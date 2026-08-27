import {ReactNode} from "react";
import {HasPermissionRefInterface} from "lys-front/providers";

/**
 * UpdateSuperUserEmailRestricted props
 */
export interface UpdateSuperUserEmailRestrictedProps {
    /**
     * Super user ID to update
     */
    userId: string;

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
 * UpdateSuperUserEmailRestricted ref interface
 */
export type UpdateSuperUserEmailRestrictedRefInterface = HasPermissionRefInterface;