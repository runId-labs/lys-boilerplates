import {ChangeEvent} from "react";

/**
 * Props for the ProgressRangeElement component
 */
export interface ProgressRangeElementProps {
    /**
     * Unique ID for the field
     */
    id: string;

    /**
     * Label text for the field
     */
    label: string;

    /**
     * Current value (0-100)
     */
    value?: number;

    /**
     * Change handler - receives event with target.value
     */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;

    /**
     * Whether the field is disabled
     */
    disabled?: boolean;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Helper text to display below the field
     */
    helperText?: string;

    /**
     * Minimum value (default: 0)
     */
    min?: number;

    /**
     * Maximum value (default: 100)
     */
    max?: number;

    /**
     * Step increment (default: 1)
     */
    step?: number;

    /**
     * Whether to show the value in the label
     */
    showValue?: boolean;

    /**
     * Optional CSS class name
     */
    className?: string;
}