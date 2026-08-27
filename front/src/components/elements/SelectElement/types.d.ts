import * as React from "react";
import {ReactNode} from "react";

/**
 * Option for the select element
 */
export interface SelectOption {
    label: string;
    value: string;
    icon?: ReactNode;
}

/**
 * Option group for the select element
 */
export interface SelectOptionGroup {
    label: string;
    options: SelectOption[];
}

/**
 * Props for the SelectElement component
 */
export interface SelectElementProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    /**
     * Unique ID for the select
     */
    id: string;

    /**
     * Label text for the select
     */
    label: string;

    /**
     * Options for the select (can be flat array or grouped)
     */
    options: SelectOption[] | SelectOptionGroup[];

    /**
     * Whether to use floating label style
     */
    isFloatingLabel?: boolean;

    /**
     * Visually hide the label (kept for accessibility). Non-floating layout only.
     */
    hideLabel?: boolean;

    /**
     * Bootstrap control size ("sm" | "lg"). Re-exposed because the native numeric
     * `size` attribute is omitted above.
     */
    size?: "sm" | "lg";

    /**
     * Whether to show an empty option
     */
    nullable?: boolean;

    /**
     * Label for the empty option
     */
    nullableLabel?: string;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Helper text to display below the select
     */
    helperText?: string;
}