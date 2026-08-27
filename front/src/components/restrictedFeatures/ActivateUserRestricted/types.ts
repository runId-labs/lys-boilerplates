/**
 * ActivateUserRestricted props
 */
export interface ActivateUserRestrictedProps {
    token: string;
    newPassword: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}

/**
 * ActivateUserRestricted ref interface
 */
export interface ActivateUserRestrictedRefInterface {
    commit: () => void;
    isInFlight: boolean;
}