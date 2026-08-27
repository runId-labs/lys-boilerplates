import {BadgeVariant, BadgeSize} from "@/components/elements/BadgeElement/types";
import {ReactNode} from "react";

/**
 * Display configuration for one enum code
 */
export interface EnumBadgeValueConfig {
    /**
     * Badge color variant for this code
     * @default "secondary"
     */
    variant?: BadgeVariant;

    /**
     * Display label (already translated by the caller)
     * Falls back to the raw code when omitted
     */
    label?: string;

    /**
     * Tooltip description shown when tooltips are enabled
     * Enables the tooltip icon for this code when present
     */
    description?: string;
}

/**
 * Props for the EnumBadgeElement component
 */
export interface EnumBadgeElementProps {
    /**
     * Enum code to display (e.g. "IN_PROGRESS", "HIGH")
     */
    code: string;

    /**
     * Display configuration per enum code
     */
    values: Record<string, EnumBadgeValueConfig>;

    /**
     * Show the tooltip on hover when a description is configured
     * @default true
     */
    showTooltip?: boolean;

    /**
     * Tooltip title (already translated by the caller)
     */
    tooltipTitle?: string;

    /**
     * Use pill style (rounded)
     */
    pill?: boolean;

    /**
     * Badge size
     */
    size?: BadgeSize;

    /**
     * Outline style (transparent background, colored border and text)
     */
    outline?: boolean;

    /**
     * Additional CSS class
     */
    className?: string;

    /**
     * Content rendered after the label (e.g. a count)
     */
    children?: ReactNode;
}
