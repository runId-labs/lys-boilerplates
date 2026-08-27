import * as React from "react";
import {ReactNode} from "react";

/**
 * Card variant types
 */
export type CardVariant =
    | "default"      // White background with subtle shadow
    | "elevated"     // Elevated with stronger shadow
    | "bordered"     // Border only, no shadow
    | "flat"         // No shadow, no border
    | "widget";      // Optimized for feature widgets (elevated + lg padding)

/**
 * Card padding types
 */
export type CardPadding =
    | "none"   // No padding
    | "sm"     // Small padding
    | "md"     // Medium padding (default)
    | "lg";    // Large padding

/**
 * Props for the CardElement component
 */
export interface CardElementProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Visual variant of the card
     */
    variant?: CardVariant;

    /**
     * Padding size
     */
    padding?: CardPadding;

    /**
     * Header content (optional)
     * Use this for full custom header control
     */
    header?: ReactNode;

    /**
     * Title for structured header (alternative to header prop)
     * If provided without header, creates a structured header with title on left
     */
    title?: string | ReactNode;

    /**
     * Actions for structured header (alternative to header prop)
     * If provided without header, creates a structured header with actions on right
     */
    actions?: ReactNode;

    /**
     * Footer content (optional)
     */
    footer?: ReactNode;

    /**
     * Card body content
     */
    children?: ReactNode;

    /**
     * Custom header className
     */
    headerClassName?: string;

    /**
     * Custom body className
     */
    bodyClassName?: string;

    /**
     * Custom footer className
     */
    footerClassName?: string;

    /**
     * Make card hoverable (subtle hover effect)
     */
    hoverable?: boolean;
}
