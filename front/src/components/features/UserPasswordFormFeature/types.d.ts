/**
 * UserPasswordFormFeature props
 */
export interface UserPasswordFormFeatureProps {
    /**
     * Submit handler for the form
     */
    onSubmit: (data: UserPasswordFormData) => void;

    /**
     * Loading state during submission
     */
    isLoading?: boolean;
}

/**
 * Form data structure
 */
export interface UserPasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}