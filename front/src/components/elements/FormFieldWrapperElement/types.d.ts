import {ReactNode} from "react";

/**
 * Props for the FormFieldWrapperElement component
 */
export interface FormFieldWrapperElementProps {
    /**
     * Unique ID for the field
     */
    id: string;

    /**
     * Label text for the field
     */
    label: string;

    /**
     * The form control element to wrap
     */
    children: ReactNode;

    /**
     * Whether to use floating label style
     */
    isFloatingLabel?: boolean;

    /**
     * Visually hide the label (kept in the DOM for accessibility via `visually-hidden`).
     * Only applies to the standard, non-floating layout — a floating label is the control's
     * placeholder and is never hidden.
     */
    hideLabel?: boolean;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Helper text to display below the field
     */
    helperText?: string;

    /**
     * Whether the field is required
     */
    required?: boolean;

    /**
     * Optional CSS class name
     */
    className?: string;
}