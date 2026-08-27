import {ReactNode} from "react";
import {Form} from "react-bootstrap";
import {cn} from "lys-front/tools";

interface CheckboxElementProps {
    /** DOM id, wired by FormFeature's custom control slot. */
    id?: string;
    /** Label content — accepts rich nodes (e.g. inline links), not just a string. */
    label: ReactNode;
    /** Checked state (FormFeature passes the raw boolean via `value`). */
    value?: boolean;
    /** Receives the new checked boolean directly (FormFeature forwards it as-is). */
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    error?: string;
    required?: boolean;
    className?: string;
}

/**
 * Bootstrap checkbox whose label may be arbitrary JSX.
 *
 * The built-in FormFeature `checkbox` control only accepts a string label; this element is meant
 * to be plugged through the `custom` control slot when the label needs inline links (e.g. legal
 * consent referencing the terms of use and the privacy policy).
 */
export default function CheckboxElement({
    id,
    label,
    value,
    onChange,
    disabled,
    error,
    required,
    className,
}: CheckboxElementProps) {
    return (
        <Form.Group className={cn("mb-3", className)}>
            <Form.Check
                id={id}
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange?.(e.target.checked)}
                disabled={disabled}
                aria-required={required}
                isInvalid={!!error}
                label={
                    <>
                        {label}
                        {required ? " *" : ""}
                    </>
                }
            />
            {error && <div className="text-danger small mt-1">{error}</div>}
        </Form.Group>
    );
}
