import {ReactNode} from "react";

/**
 * Badge variant types (Bootstrap color schemes)
 */
export type BadgeVariant =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";

/**
 * Badge size types
 */
export type BadgeSize = "sm" | "md";

/**
 * Props for the BadgeElement component
 */
export interface BadgeElementProps {
    /**
     * Visual variant of the badge
     */
    variant?: BadgeVariant;

    /**
     * Badge content
     */
    children: ReactNode;

    /**
     * Additional CSS class
     */
    className?: string;

    /**
     * Whether to use pill style (rounded)
     */
    pill?: boolean;

    /**
     * Background color variant (alias for variant for compatibility)
     */
    bg?: BadgeVariant;

    /**
     * Badge size (affects padding)
     * @default "md"
     */
    size?: BadgeSize;

    /**
     * Outline style: transparent background with a coloured border and text
     * (low-emphasis variant of the colour). Default false (solid fill).
     */
    outline?: boolean;
}
