import React from "react";

/**
 * InfoTooltipElement props
 */
export interface InfoTooltipElementProps {
    /**
     * The text content to display in the tooltip
     */
    content: string;

    /**
     * Optional title for the tooltip header
     */
    title?: string;

    /**
     * Placement of the tooltip
     * @default "top"
     */
    placement?: "top" | "bottom" | "left" | "right";

    /**
     * Size of the info icon
     * @default "sm"
     */
    size?: "sm" | "md";

    /**
     * Optional CSS class name
     */
    className?: string;

    /**
     * Inherit color from parent element (uses currentColor)
     * Useful when used inside colored components like badges
     * @default false
     */
    inheritColor?: boolean;

    /**
     * Optional children to wrap. The info icon is rendered next to the
     * children so the tooltip remains discoverable for users (mouse and
     * keyboard alike).
     */
    children?: React.ReactNode;
}