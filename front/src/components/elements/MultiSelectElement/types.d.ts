/**
 * Option for the multi-select element
 */
export interface MultiSelectOption {
    label: string;
    value: string;
}

/**
 * Props for the MultiSelectElement component
 */
export interface MultiSelectElementProps {
    /**
     * Unique ID for the multi-select
     */
    id: string;

    /**
     * Label text for the multi-select
     */
    label: string;

    /**
     * Available options
     */
    options: MultiSelectOption[];

    /**
     * Currently selected values
     */
    value: string[];

    /**
     * Change handler - receives the updated array of selected values
     */
    onChange: (value: string[]) => void;

    /**
     * Whether the multi-select is disabled
     */
    disabled?: boolean;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Helper text to display below the control
     */
    helperText?: string;

    /**
     * Placeholder text when no options are selected
     */
    placeholder?: string;

    /**
     * Whether at least one selection is required
     */
    required?: boolean;

    /**
     * Whether to use floating label style
     */
    isFloatingLabel?: boolean;
}
