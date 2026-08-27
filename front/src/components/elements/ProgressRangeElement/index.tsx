import React, {ChangeEvent, useCallback} from "react";
import {Form} from "react-bootstrap";
import {ProgressRangeElementProps} from "./types";
import FormFieldWrapperElement from "@/components/elements/FormFieldWrapperElement";
import "./styles.scss";

/**
 * ProgressRangeElement
 *
 * Element component (Layer 1) that provides:
 * - Range slider input for progress percentage (0-100)
 * - Visual display of current value in label
 * - Consistent styling with form field wrapper
 * - Accessible range control
 *
 * Compatible with FormFeature custom component interface.
 */
const ProgressRangeElement: React.FC<ProgressRangeElementProps> = ({
    id,
    label,
    value,
    onChange,
    disabled = false,
    error,
    helperText,
    min = 0,
    max = 100,
    step = 1,
    showValue = true,
    className
}) => {
    const currentValue = value ?? min;

    /**
     * Handle change event
     */
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
    }, [onChange]);

    /**
     * Build label with value if showValue is true
     */
    const displayLabel = showValue
        ? `${label} : ${currentValue}%`
        : label;

    return (
        <FormFieldWrapperElement
            id={id}
            label={displayLabel}
            error={error}
            helperText={helperText}
            className={className}
        >
            <Form.Range
                id={id}
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleChange}
                disabled={disabled}
                className="progress-range-element"
            />
        </FormFieldWrapperElement>
    );
};

ProgressRangeElement.displayName = "ProgressRangeElement";

export default ProgressRangeElement;