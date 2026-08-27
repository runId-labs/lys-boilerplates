/**
 * Password validation rule
 */
export interface PasswordRule {
    key: string;
    regExp: RegExp;
    level: "error" | "warning";
}

/**
 * Password strength level
 */
export type PasswordStrength =
    | "veryWeak"
    | "weak"
    | "good"
    | "strong"
    | "veryStrong";

/**
 * Props for the PasswordCheckerFeature component
 */
export interface PasswordCheckerFeatureProps {
    /**
     * Password value to validate
     */
    valueToTest: string;

    /**
     * Callback when validation state changes
     */
    setIsTestPassed: (isTestPassed: boolean) => void;

    /**
     * Whether to use floating label style
     */
    isFloatingLabel?: boolean;

    /**
     * Whether the checker is disabled
     */
    disabled?: boolean;

    /**
     * Translation prefix for i18n keys
     */
    transPrefix?: string;

    /**
     * ID for the password confirmation field
     */
    confirmationId?: string;

    /**
     * Optional CSS class name
     */
    className?: string;
}