/**
 * Props for ConfirmationFeature component
 */
export interface ConfirmationFeatureProps {
    /**
     * Message to display
     */
    message: string;

    /**
     * Callback when user confirms
     */
    onConfirm: () => void;

    /**
     * Callback when user cancels
     */
    onCancel: () => void;

    /**
     * Confirm button text
     */
    confirmText?: string;

    /**
     * Cancel button text
     */
    cancelText?: string;

    /**
     * Confirm button variant
     */
    confirmVariant?: "primary" | "danger" | "success";

    /**
     * Whether the confirm action is in progress
     */
    isLoading?: boolean;
}