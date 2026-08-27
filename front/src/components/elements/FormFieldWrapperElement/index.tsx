import React from "react";
import {Form} from "react-bootstrap";
import {FormFieldWrapperElementProps} from "./types";
import {cn} from "lys-front/tools";

/**
 * FormFieldWrapperElement
 *
 * Wraps form controls with consistent label, error, and helper text handling.
 * Supports both floating labels and standard labels.
 * Provides accessibility attributes and error styling.
 */
const FormFieldWrapperElement: React.FC<FormFieldWrapperElementProps> = ({
    id,
    label,
    children,
    isFloatingLabel = false,
    hideLabel = false,
    error,
    helperText,
    required = false,
    className = "",
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const helperTextId = helperText ? `${id}-helper` : undefined;
    const describedBy = [errorId, helperTextId].filter(Boolean).join(" ") || undefined;

    const labelText = label + (required ? " *" : "");

    if (isFloatingLabel) {
        return (
            <div className={cn("form-field-wrapper-element", className)}>
                <Form.Floating>
                    {React.cloneElement(children as React.ReactElement, {
                        "aria-invalid": !!error,
                        "aria-describedby": describedBy,
                        "aria-required": required,
                        className: cn(
                            (children as React.ReactElement).props.className,
                            error && "is-invalid"
                        ),
                    })}
                    <label htmlFor={id}>{labelText}</label>
                </Form.Floating>
                {error && (
                    <Form.Control.Feedback type="invalid" id={errorId} className="d-block">
                        {error}
                    </Form.Control.Feedback>
                )}
                {helperText && !error && (
                    <Form.Text id={helperTextId} muted>
                        {helperText}
                    </Form.Text>
                )}
            </div>
        );
    }

    return (
        <div className={cn("form-field-wrapper-element", className)}>
            <Form.Label htmlFor={id} className={cn(hideLabel && "visually-hidden")}>
                {labelText}
            </Form.Label>
            {React.cloneElement(children as React.ReactElement, {
                "aria-invalid": !!error,
                "aria-describedby": describedBy,
                "aria-required": required,
                className: cn(
                    (children as React.ReactElement).props.className,
                    error && "is-invalid"
                ),
            })}
            {error && (
                <Form.Control.Feedback type="invalid" id={errorId} className="d-block">
                    {error}
                </Form.Control.Feedback>
            )}
            {helperText && !error && (
                <Form.Text id={helperTextId} muted>
                    {helperText}
                </Form.Text>
            )}
        </div>
    );
};

export default FormFieldWrapperElement;