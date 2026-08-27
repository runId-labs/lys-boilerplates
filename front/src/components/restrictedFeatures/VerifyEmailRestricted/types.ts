/**
 * VerifyEmailRestricted props
 */
export interface VerifyEmailRestrictedProps {
    token: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}

/**
 * VerifyEmailRestricted ref interface
 */
export interface VerifyEmailRestrictedRefInterface {
    hasPermission: boolean;
}
