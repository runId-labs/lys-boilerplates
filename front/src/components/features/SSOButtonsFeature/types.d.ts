/**
 * Props for the SSOButtonsFeature component
 */
export interface SSOButtonsFeatureProps {
    /**
     * SSO mode: "login", "signup", or "link"
     */
    mode: "login" | "signup" | "link";

    /**
     * Position of the divider text relative to the SSO buttons.
     * "before" renders the divider above the buttons, "after" renders it below.
     * Defaults to "before".
     */
    dividerPosition?: "before" | "after";

    /**
     * Optional CSS class name
     */
    className?: string;
}

/**
 * SSO provider data from GraphQL
 */
export interface SSOProvider {
    providerId: string;
    name: string;
    loginUrl: string;
}
