import * as React from "react";
import {ReactNode} from "react";

/**
 * Props for the InputElement component
 */
export interface InputElementProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    /**
     * Unique ID for the input
     */
    id: string;

    /**
     * Label text for the input
     */
    label: string;

    /**
     * Value of the input
     */
    value?: string | number;

    /**
     * Render as different element (e.g., "textarea")
     */
    as?: "input" | "textarea";

    /**
     * Whether to use floating label style
     */
    isFloatingLabel?: boolean;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Helper text to display below the input
     */
    helperText?: string;

    /**
     * Icon to display on the left side
     */
    leftIcon?: ReactNode;

    /**
     * Icon to display on the right side
     */
    rightIcon?: ReactNode;

    /**
     * Show clear button (X) when input has value
     */
    showClearButton?: boolean;

    /**
     * Callback when clear button is clicked
     */
    onClear?: () => void;

    /**
     * Show character counter
     */
    showCharacterCount?: boolean;

    /**
     * Maximum length for character counter
     */
    maxLength?: number;

    /**
     * Auto-resize textarea to fit content (only works with as="textarea")
     */
    autoResize?: boolean;
}
