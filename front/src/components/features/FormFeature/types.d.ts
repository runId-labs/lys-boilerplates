import {HTMLInputTypeAttribute, ReactElement, ComponentType} from "react";
import {Validator} from "lys-front/tools";
import {SelectOption, SelectOptionGroup} from "@/components/elements/SelectElement/types";

/**
 * Column specification for Bootstrap grid
 */
export type ColSpec = boolean | "auto" | number | {span?: boolean | number | "auto"; offset?: number; order?: number};

/**
 * Form control types
 */
export type FormControlType =
    | HTMLInputTypeAttribute
    | "select"
    | "checkbox"
    | "switch"
    | "textarea"
    | "password_edit"
    | "custom";

/**
 * Description of a single form control
 */
export interface FormControlDescription {
    /**
     * Label for the control
     */
    label: string;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Type of the control
     */
    type?: FormControlType;

    /**
     * Whether the field is required
     */
    required?: boolean;

    /**
     * Custom CSS class
     */
    className?: string;

    /**
     * Whether the field is disabled
     */
    disabled?: boolean;

    /**
     * Use floating label style
     */
    isFloatingLabel?: boolean;

    /**
     * Bootstrap grid column specifications
     */
    xs?: ColSpec;
    sm?: ColSpec;
    md?: ColSpec;
    lg?: ColSpec;
    xl?: ColSpec;
    xxl?: ColSpec;

    /**
     * Key for the value in the parameters object
     * Supports dot notation for nested objects (e.g., "user.profile.email")
     */
    valueKey: string;

    /**
     * Options for select controls
     */
    options?: SelectOption[] | SelectOptionGroup[];

    /**
     * Whether select allows null/empty value
     */
    nullable?: boolean;

    /**
     * Validator function for the field
     */
    validator?: Validator;

    /**
     * Helper text to display below the field
     */
    helperText?: string;

    /**
     * Maximum length for text inputs
     */
    maxLength?: number;

    /**
     * Show character counter for text inputs
     */
    showCharacterCount?: boolean;

    /**
     * Auto-resize textarea to fit content (only works with type="textarea")
     */
    autoResize?: boolean;

    /**
     * Enable AI improvement for textarea (only works with type="textarea")
     */
    aiImprove?: boolean;

    /**
     * Context hint for AI improvement (e.g., "a project description")
     */
    aiContext?: string;

    /**
     * Language for AI improvement (default: "fr")
     */
    aiLanguage?: string;

    /**
     * Custom component to render (only used when type === "custom")
     * The component will receive: id, value, onChange, disabled, error, formValues
     * (all current form values, for controls that depend on sibling fields), and any customProps
     */
    customComponent?: ComponentType<any>;

    /**
     * Additional props to pass to custom component
     */
    customProps?: Record<string, any>;
}

/**
 * Section of form controls
 */
export interface FormSection {
    /**
     * Unique key for the section
     */
    uniqueKey: string;

    /**
     * Controls in this section
     */
    controls: FormControlDescription[];

    /**
     * Optional title for the section
     */
    title?: string;
}

/**
 * Props for the FormFeature component
 */
export interface FormFeatureProps {
    /**
     * Unique key for the form
     */
    uniqueKey: string;

    /**
     * Form sections
     */
    sections: FormSection[];

    /**
     * Callback when form is submitted with valid data
     */
    submit: (parameters: { [key: string]: any }, targetId?: string) => void;

    /**
     * Optional target ID passed to submit callback
     */
    targetId?: string;

    /**
     * Whether the form submission is in progress
     */
    isInFlight?: boolean;

    /**
     * Initial parameter values
     */
    initParameters?: { [key: string]: any };

    /**
     * Whether the form is disabled (read-only mode)
     */
    disabled?: boolean;

    /**
     * Translation prefix for i18n
     */
    transPrefix?: string;

    /**
     * Custom CSS class
     */
    className?: string;

    /**
     * Custom footer content
     */
    footer?: ReactElement;

    /**
     * ID of parent element for scroll anchoring
     */
    parentElementId?: string;

    /**
     * Show section titles
     */
    showSectionTitles?: boolean;

    /**
     * Submit button text (override default translation)
     */
    submitButtonText?: string;

    /**
     * Show reset button next to submit
     */
    showReset?: boolean;

    /**
     * Reset button text (override default translation)
     */
    resetButtonText?: string;
}

/**
 * Form feature ref interface
 */
export interface FormFeatureRef {
    /**
     * Whether the form is currently being cleared
     */
    clearing: boolean;

    /**
     * Clear the form and reset to initial values
     */
    clear: () => void;

    /**
     * Get current form values
     */
    getValues: () => { [key: string]: any };

    /**
     * Set form values programmatically
     */
    setValues: (values: { [key: string]: any }) => void;
}