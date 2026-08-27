/**
 * ResetPasswordRestricted props
 */
export interface ResetPasswordRestrictedProps {
    token: string;
    newPassword: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}

/**
 * ResetPasswordRestricted ref interface
 */
export interface ResetPasswordRestrictedRefInterface {
    commit: () => void;
    isInFlight: boolean;
}