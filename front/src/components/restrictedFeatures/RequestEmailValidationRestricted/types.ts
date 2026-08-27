/**
 * RequestEmailValidationRestricted props
 */
export interface RequestEmailValidationRestrictedProps {
    userId: string;
    validatedAt?: string | null;
}

/**
 * RequestEmailValidationRestricted ref interface
 */
export interface RequestEmailValidationRestrictedRefInterface {
    hasPermission: boolean;
}