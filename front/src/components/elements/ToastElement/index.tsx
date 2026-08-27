import React from "react";
import {Toast} from "react-bootstrap";
import {ToastElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * ToastElement component
 *
 * Wrapper around React Bootstrap Toast:
 * - Multiple variants (default, success, warning, danger, info)
 * - Optional title, body (required), and footer
 * - Auto-dismiss with configurable delay
 * - Close button
 * - Uses design tokens for consistent styling
 */
const ToastElement: React.FC<ToastElementProps> = ({
    variant = "default",
    title,
    body,
    footer,
    show = true,
    onClose,
    delay = 5000,
    autohide = true,
    className,
    headerClassName,
    bodyClassName,
    footerClassName,
    badgeCount,
}) => {
    // Map variants to Bootstrap bg colors
    const bgVariant = variant === "default" ? "light" : variant;

    return (
        <Toast
            show={show}
            onClose={onClose}
            delay={delay}
            autohide={autohide}
            bg={bgVariant}
            className={cn("toast-element", className)}
        >
            {badgeCount !== undefined && badgeCount > 1 && (
                <span className="toast-element__badge">{badgeCount}</span>
            )}
            {title && (
                <Toast.Header className={cn("toast-element__header", headerClassName)}>
                    <strong className="me-auto">{title}</strong>
                </Toast.Header>
            )}
            <Toast.Body className={cn("toast-element__body", bodyClassName)}>
                {body}
                {footer && (
                    <div className={cn("toast-element__footer", footerClassName)}>
                        {footer}
                    </div>
                )}
            </Toast.Body>
        </Toast>
    );
};

ToastElement.displayName = "ToastElement";

export default ToastElement;