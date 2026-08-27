import React, {useMemo} from "react";
import {cva} from "class-variance-authority";
import {CardElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * CardElement component
 *
 * A flexible card wrapper for creating widget-style layouts:
 * - Multiple visual variants (default, elevated, bordered, flat, widget)
 * - Widget variant: optimized for feature components with auto lg padding
 * - Configurable padding levels
 * - Optional header and footer sections
 * - Hover effects for interactive cards
 * - Uses design tokens for consistent spacing and shadows
 */

const cardVariants = cva("card-element", {
    variants: {
        variant: {
            default: "card-element--default",
            elevated: "card-element--elevated",
            bordered: "card-element--bordered",
            flat: "card-element--flat",
            widget: "card-element--widget",
        },
        padding: {
            none: "card-element--padding-none",
            sm: "card-element--padding-sm",
            md: "card-element--padding-md",
            lg: "card-element--padding-lg",
        },
        hoverable: {
            true: "card-element--hoverable",
            false: "",
        },
    },
    defaultVariants: {
        variant: "default",
        padding: "md",
        hoverable: false,
    },
});

const CardElement = React.forwardRef<HTMLDivElement, CardElementProps>(
    (
        {
            variant = "default",
            padding = "md",
            header,
            title,
            actions,
            footer,
            children,
            className,
            headerClassName,
            bodyClassName,
            footerClassName,
            hoverable = false,
            ...props
        },
        ref
    ) => {
        // Widget variant automatically uses large padding
        const effectivePadding = variant === "widget" ? "lg" : padding;

        // Build header content (memoized to avoid recreating JSX on every render)
        const headerContent = useMemo(() => {
            if (header) {
                // Custom header takes precedence
                return header;
            }
            if (title || actions) {
                // Structured header with title and actions
                return (
                    <div className="d-flex gap-2 align-items-center justify-content-between">
                        {title && (
                            <div className="flex-grow-1">
                                {typeof title === "string" ? (
                                    <h6 className="mb-0">{title}</h6>
                                ) : (
                                    title
                                )}
                            </div>
                        )}
                        {actions && <div className="d-flex gap-2 align-items-center ms-auto">{actions}</div>}
                    </div>
                );
            }
            return null;
        }, [header, title, actions]);

        return (
            <div
                ref={ref}
                className={cn(
                    cardVariants({variant, padding: effectivePadding, hoverable}),
                    className
                )}
                {...props}
            >
                {headerContent && (
                    <div className={cn("card-element__header", headerClassName)}>
                        {headerContent}
                    </div>
                )}
                <div className={cn("card-element__body", bodyClassName)}>
                    {children}
                </div>
                {footer && (
                    <div className={cn("card-element__footer", footerClassName)}>
                        {footer}
                    </div>
                )}
            </div>
        );
    }
);

CardElement.displayName = "CardElement";

export default CardElement;
