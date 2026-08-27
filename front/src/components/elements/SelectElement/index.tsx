import React, {useEffect} from "react";
import {Form} from "react-bootstrap";
import {SelectElementProps, SelectOption, SelectOptionGroup} from "./types";
import FormFieldWrapperElement from "../FormFieldWrapperElement";

/**
 * SelectElement component
 *
 * Element component (Layer 1) - Pure UI wrapper around React Bootstrap Form.Select
 *
 * Features:
 * - Support for floating labels
 * - Error and helper text display
 * - Option groups support
 * - Nullable option
 * - Accessibility attributes
 *
 * This is a pure Element (Layer 1) - no business logic or context hooks.
 */
const SelectElement = React.forwardRef<HTMLSelectElement, SelectElementProps>(
    (
        {
            id,
            label,
            options,
            isFloatingLabel = false,
            hideLabel = false,
            size,
            nullable = false,
            nullableLabel = "-",
            error,
            helperText,
            value,
            disabled = false,
            required = false,
            className,
            onChange,
            ...props
        },
        ref
    ) => {
        const isGrouped = options.length > 0 && "options" in options[0];

        // Auto-select first option when nullable=false and value is empty
        useEffect(() => {
            if (!nullable && options.length > 0 && !value && onChange) {
                const firstValue = isGrouped
                    ? (options as SelectOptionGroup[])[0]?.options[0]?.value
                    : (options as SelectOption[])[0]?.value;

                if (firstValue) {
                    onChange({target: {value: firstValue}} as React.ChangeEvent<HTMLSelectElement>);
                }
            }
        }, [nullable, options, value, onChange, isGrouped]);

        const renderOptions = () => {
            if (isGrouped) {
                return (options as SelectOptionGroup[]).map((group, groupIndex) => (
                    <optgroup key={`group-${groupIndex}`} label={group.label}>
                        {group.options.map((option, optionIndex) => (
                            <option
                                key={`${id}-option-${groupIndex}-${optionIndex}`}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                ));
            }

            return (options as SelectOption[]).map((option, index) => (
                <option
                    key={`${id}-option-${index}`}
                    value={option.value}
                >
                    {option.label}
                </option>
            ));
        };

        const selectElement = (
            <Form.Select
                ref={ref}
                id={id}
                size={size}
                value={value ?? ""}
                disabled={disabled}
                required={required}
                className={className}
                onChange={onChange}
                {...props}
            >
                {nullable && (
                    <option value="">
                        {nullableLabel}
                    </option>
                )}
                {renderOptions()}
            </Form.Select>
        );

        return (
            <FormFieldWrapperElement
                id={id}
                label={label}
                isFloatingLabel={isFloatingLabel}
                hideLabel={hideLabel}
                error={error}
                helperText={helperText}
                required={required}
            >
                {selectElement}
            </FormFieldWrapperElement>
        );
    }
);

SelectElement.displayName = "SelectElement";

export default SelectElement;