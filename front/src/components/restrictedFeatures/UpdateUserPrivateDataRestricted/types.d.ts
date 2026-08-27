import {ReactNode} from "react";
import {HasPermissionRefInterface} from "lys-front/providers";

/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * UpdateUserPrivateDataRestricted props
 */
export interface UpdateUserPrivateDataRestrictedProps {
    /**
     * User ID
     */
    userId: string;

    /**
     * Access parameters for OWNER permission checking
     */
    accessParameters?: AccessParameters | null;

    /**
     * Current first name
     */
    firstName?: string;

    /**
     * Current last name
     */
    lastName?: string;

    /**
     * Current gender code
     */
    genderCode?: string;

    /**
     * Current language code
     */
    languageCode?: string;

    /**
     * Optional footer content for the card
     */
    footer?: ReactNode;

    /**
     * Optional callback called after successful mutation
     */
    onCompleted?: (response: any) => void;
}

/**
 * UpdateUserPrivateDataRestricted ref interface
 */
export type UpdateUserPrivateDataRestrictedRefInterface = HasPermissionRefInterface;
