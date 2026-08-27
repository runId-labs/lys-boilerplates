import {BadgeVariant} from "@/components/elements/BadgeElement/types";

export interface CountBadgeElementProps {
    /**
     * List of items to display (as strings)
     */
    items: readonly string[] | string[];

    /**
     * Label for the popover header
     */
    popoverTitle?: string;

    /**
     * Enable/disable the popover overlay (default: true)
     */
    showPopover?: boolean;

    /**
     * Optional ID for the popover (defaults to random)
     */
    popoverId?: string;

    /**
     * Badge variant (color scheme)
     */
    variant?: BadgeVariant;

    /**
     * Optional empty state display (default: "-")
     */
    emptyDisplay?: string;

    /**
     * Additional CSS class
     */
    className?: string;
}