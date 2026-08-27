import {HasPermissionRefInterface} from "lys-front/providers";

/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * UpdateUserPasswordRestricted props
 */
export interface UpdateUserPasswordRestrictedProps {
    /**
     * User ID
     */
    userId: string;

    /**
     * Access parameters for OWNER permission checking
     */
    accessParameters?: AccessParameters | null;
}

/**
 * UpdateUserPasswordRestricted ref interface
 */
export type UpdateUserPasswordRestrictedRefInterface = HasPermissionRefInterface;