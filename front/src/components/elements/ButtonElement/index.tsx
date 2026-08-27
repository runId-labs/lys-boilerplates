import React from "react";
import {Button, Spinner} from "react-bootstrap";
import {ButtonElementProps} from "./types";
import {cn} from "lys-front/tools";

/**
 * ButtonElement component
 *
 * Wrapper around React Bootstrap Button with additional features:
 * - Loading state with spinner
 * - Left and right icons support
 * - Full width option
 * - All Bootstrap variants
 */
const ButtonElement = React.forwardRef<HTMLButtonElement, ButtonElementProps>(
    (
        {
            variant = "primary",
            size,
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            fullWidth = false,
            disabled,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <Button
                variant={variant}
                size={size}
                disabled={disabled || isLoading}
                className={cn(
                    "button-element",
                    fullWidth && "w-100",
                    className
                )}
                ref={ref}
                {...props}
            >
                {isLoading && (
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                    />
                )}
                {!isLoading && leftIcon && (
                    <span className="button-left-icon me-2" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}
                {children}
                {!isLoading && rightIcon && (
                    <span className="button-right-icon ms-2" aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </Button>
        );
    }
);

ButtonElement.displayName = "ButtonElement";

export default ButtonElement;