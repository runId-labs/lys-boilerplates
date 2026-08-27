/**
 * Props for the ColorPickerElement component
 *
 * Compatible with FormFeature's custom component contract:
 * - id, value, onChange, disabled, error are passed by FormFeature
 */
export interface ColorPickerElementProps {
    /**
     * Unique ID for the input
     */
    id?: string;

    /**
     * Current hex color value (e.g. "#3B82F6")
     */
    value?: string;

    /**
     * Called when color changes — emits hex string (e.g. "#3B82F6")
     */
    onChange: (value: string) => void;

    /**
     * Whether the input is disabled
     */
    disabled?: boolean;

    /**
     * Error message to display
     */
    error?: string;
}
