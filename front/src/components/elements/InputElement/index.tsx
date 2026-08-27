import React, {useEffect, useRef} from "react";
import {Form, InputGroup} from "react-bootstrap";
import {InputElementProps} from "./types";
import FormFieldWrapperElement from "../FormFieldWrapperElement";
import {useInputElementTranslations} from "./translations";

/**
 * InputElement component
 *
 * Wrapper around React Bootstrap Form.Control with enhanced features:
 * - Support for floating labels
 * - Error and helper text display
 * - Left and right icons
 * - Clear button functionality
 * - Character counter
 * - Accessibility attributes
 */
const InputElement = React.forwardRef<HTMLInputElement, InputElementProps>(
    (
        {
            id,
            label,
            as = "input",
            isFloatingLabel = false,
            error,
            helperText,
            leftIcon,
            rightIcon,
            showClearButton = false,
            onClear,
            showCharacterCount = false,
            maxLength,
            value,
            disabled = false,
            required = false,
            className,
            type = "text",
            autoResize = false,
            ...props
        },
        ref
    ) => {
        const internalRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
        const hasValue = value !== undefined && value !== null && value !== "";
        const showClear = showClearButton && hasValue && !disabled;
        const charCount = typeof value === "string" ? value.length : 0;
        const {t} = useInputElementTranslations();

        // Auto-resize textarea
        useEffect(() => {
            if (autoResize && as === "textarea" && internalRef.current) {
                const textarea = internalRef.current as HTMLTextAreaElement;
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }, [value, autoResize, as]);

        const handleClear = () => {
            if (onClear) {
                onClear();
            }
        };

        // Combine refs for autoResize
        const setRefs = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
            (internalRef as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = element;
            if (typeof ref === "function") {
                ref(element as HTMLInputElement);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = element as HTMLInputElement;
            }
        };

        const inputElement = (
            <Form.Control
                ref={setRefs}
                as={as}
                id={id}
                type={as === "input" ? type : undefined}
                value={value ?? ""}
                disabled={disabled}
                required={required}
                maxLength={maxLength}
                className={className}
                style={autoResize && as === "textarea" ? {overflow: "hidden", resize: "none"} : undefined}
                {...props}
            />
        );

        const needsInputGroup = leftIcon || rightIcon || showClear;

        const wrappedInput = needsInputGroup ? (
            <InputGroup>
                {leftIcon && (
                    <InputGroup.Text>
                        {leftIcon}
                    </InputGroup.Text>
                )}
                {inputElement}
                {showClear && (
                    <InputGroup.Text
                        role="button"
                        onClick={handleClear}
                        style={{cursor: "pointer"}}
                        aria-label={t("clearInputAriaLabel")}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleClear();
                            }
                        }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </InputGroup.Text>
                )}
                {rightIcon && !showClear && (
                    <InputGroup.Text>
                        {rightIcon}
                    </InputGroup.Text>
                )}
            </InputGroup>
        ) : (
            inputElement
        );

        const finalHelperText = showCharacterCount && maxLength
            ? `${charCount}/${maxLength}${helperText ? ` • ${helperText}` : ""}`
            : helperText;

        return (
            <FormFieldWrapperElement
                id={id}
                label={label}
                isFloatingLabel={isFloatingLabel}
                error={error}
                helperText={finalHelperText}
                required={required}
            >
                {wrappedInput}
            </FormFieldWrapperElement>
        );
    }
);

InputElement.displayName = "InputElement";

export default InputElement;