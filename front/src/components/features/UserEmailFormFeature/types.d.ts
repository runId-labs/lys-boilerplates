/**
 * UserEmailFormFeature props
 */
export interface UserEmailFormFeatureProps {
    /**
     * Current email address to display
     */
    currentEmail: string;

    /**
     * Submit handler for the form
     */
    onSubmit: (data: UserEmailFormData) => void;

    /**
     * Loading state during submission
     */
    isLoading?: boolean;

    /**
     * Whether the form is disabled (read-only mode)
     */
    disabled?: boolean;
}

/**
 * Form data structure
 */
export interface UserEmailFormData {
    email: string;
}

/**
 * UserEmailFormFeature ref interface
 */
export interface UserEmailFormFeatureRef {
    /**
     * Reset form to initial values
     */
    reset: () => void;
}