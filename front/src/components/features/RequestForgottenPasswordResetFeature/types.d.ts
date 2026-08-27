export interface RequestForgottenPasswordResetFeatureProps {
    /**
     * Callback when form is submitted with email
     */
    onSubmit: (email: string) => void;

    /**
     * Whether the form is currently submitting
     */
    isLoading?: boolean;
}
