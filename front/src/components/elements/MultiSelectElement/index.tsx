import React, {useCallback, useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import {MultiSelectElementProps} from "./types";
import {cn} from "lys-front/tools";
import FormFieldWrapperElement from "@/components/elements/FormFieldWrapperElement";
import BadgeElement from "@/components/elements/BadgeElement";
import "./styles.scss";

/**
 * MultiSelectElement component
 *
 * Element component (Layer 1) that provides:
 * - Dropdown with checkboxes for multiple selections
 * - Badge display for selected values
 * - Supports floating label via FormFieldWrapperElement
 * - Keyboard accessible
 */
const MultiSelectElement: React.FC<MultiSelectElementProps> = ({
    id,
    label,
    options,
    value = [],
    onChange,
    disabled = false,
    error,
    helperText,
    placeholder,
    required = false,
    isFloatingLabel = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    /**
     * Close dropdown on outside click
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    /**
     * Toggle dropdown visibility
     */
    const handleToggle = useCallback(() => {
        if (!disabled) {
            setIsOpen(prev => !prev);
        }
    }, [disabled]);

    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
        } else if (event.key === "Escape") {
            setIsOpen(false);
        }
    }, [handleToggle]);

    /**
     * Handle option toggle
     */
    const handleOptionToggle = useCallback((optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    }, [value, onChange]);

    /**
     * Get labels for selected values
     */
    const selectedLabels = options.filter(opt => value.includes(opt.value));
    const hasValue = selectedLabels.length > 0;

    return (
        <FormFieldWrapperElement
            id={id}
            label={label}
            error={error}
            helperText={helperText}
            required={required}
            isFloatingLabel={isFloatingLabel}
        >
            <div
                className={cn(
                    "multi-select-element",
                    isFloatingLabel && "multi-select-element--floating",
                    hasValue && "multi-select-element--has-value",
                    disabled && "multi-select-element--disabled"
                )}
                ref={containerRef}
            >
                <div
                    id={id}
                    className={cn(
                        "multi-select-element__toggle",
                        isOpen && "show",
                        disabled && "disabled",
                        error && "is-invalid"
                    )}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-label={label}
                    aria-required={required}
                    aria-invalid={!!error}
                    tabIndex={disabled ? -1 : 0}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                >
                    {!hasValue && (
                        <span className="multi-select-element__placeholder">
                            {!isFloatingLabel ? (placeholder || label) : "\u00A0"}
                        </span>
                    )}
                    {hasValue && selectedLabels.map(opt => (
                        <span
                            key={opt.value}
                            className="multi-select-element__badge-wrapper"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled) handleOptionToggle(opt.value);
                            }}
                        >
                            <BadgeElement variant="info" className="multi-select-element__badge">
                                {opt.label}
                                <i className="bi bi-x ms-1" />
                            </BadgeElement>
                        </span>
                    ))}
                </div>

                {isOpen && !disabled && (
                    <div className="multi-select-element__dropdown" role="listbox" aria-multiselectable="true">
                        {options.map(option => (
                            <div
                                key={option.value}
                                className="multi-select-element__option"
                                role="option"
                                aria-selected={value.includes(option.value)}
                                onClick={() => handleOptionToggle(option.value)}
                            >
                                <Form.Check
                                    type="checkbox"
                                    label={option.label}
                                    checked={value.includes(option.value)}
                                    onChange={() => {}}
                                    style={{pointerEvents: "none"}}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FormFieldWrapperElement>
    );
};

MultiSelectElement.displayName = "MultiSelectElement";

export default MultiSelectElement;