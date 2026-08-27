/**
 * Props for the LoginFeature component
 */
export interface LoginFeatureProps {
    /**
     * Callback function called when the form is submitted with valid credentials
     */
    onSubmit: (email: string, password: string) => void;

    /**
     * Indicates if the login request is in progress
     */
    isLoading?: boolean;

    /**
     * Optional CSS class name for custom styling
     */
    className?: string;
}