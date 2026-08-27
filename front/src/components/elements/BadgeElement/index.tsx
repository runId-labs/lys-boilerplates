import React from "react";
import {Badge} from "react-bootstrap";
import {BadgeElementProps} from "./types";
import {cn} from "lys-front/tools";

/**
 * BadgeElement component
 *
 * Element component (Layer 1) that provides:
 * - Wrapper around React Bootstrap Badge
 * - Consistent styling across the application
 * - Support for all Bootstrap badge variants
 * - Pill style option
 * - Size variants (sm for compact, md for standard)
 *
 * This is an element component (Layer 1) that:
 * - Wraps react-bootstrap Badge for consistency
 * - Provides unified API for badge usage
 * - Enables easy theming and customization
 */
const BadgeElement: React.FC<BadgeElementProps> = ({
    variant = "primary",
    bg,
    children,
    className,
    pill = false,
    size = "md",
    outline = false
}) => {
    // Use bg prop if provided (for compatibility with react-bootstrap API)
    const finalVariant = bg || variant;

    // Determine padding based on size
    const paddingClass = size === "sm" ? "" : "px-3 py-2";

    // Outline style: transparent fill, coloured border + text (low-emphasis variant).
    const outlineClass = outline ? `border border-${finalVariant} text-${finalVariant}` : "";

    return (
        <Badge
            bg={outline ? "transparent" : finalVariant}
            pill={pill}
            className={cn("badge-element", paddingClass, outlineClass, className)}
        >
            {children}
        </Badge>
    );
};

BadgeElement.displayName = "BadgeElement";

export default BadgeElement;
