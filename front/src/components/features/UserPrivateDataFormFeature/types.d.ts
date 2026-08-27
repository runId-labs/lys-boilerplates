/**
 * UserPrivateDataFormFeature props
 */
export interface UserPrivateDataFormFeatureProps {
    /**
     * Submit handler for the form
     */
    onSubmit: (data: UserPrivateDataFormData) => void;

    /**
     * Loading state during submission
     */
    isLoading?: boolean;

    /**
     * Initial values for the form
     */
    initialValues?: Partial<UserPrivateDataFormData>;

    /**
     * Whether the form is disabled (read-only mode)
     */
    disabled?: boolean;
}

/**
 * Form data structure
 */
export interface UserPrivateDataFormData {
    firstName: string;
    lastName: string;
    genderCode: string;
    languageCode: string;
}

/**
 * UserPrivateDataFormFeature ref interface
 */
export interface UserPrivateDataFormFeatureRef {
    /**
     * Reset form to initial values
     */
    reset: () => void;
}
