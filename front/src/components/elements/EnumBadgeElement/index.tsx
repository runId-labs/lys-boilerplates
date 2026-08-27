import React from "react";
import {EnumBadgeElementProps, EnumBadgeValueConfig} from "./types";
import BadgeElement from "@/components/elements/BadgeElement";
import InfoTooltipElement from "@/components/elements/InfoTooltipElement";

/**
 * Resolves the display config for a code, with safe defaults
 */
const resolveValueConfig = (
    values: Record<string, EnumBadgeValueConfig>,
    code: string
): EnumBadgeValueConfig => values[code] ?? {};

/**
 * EnumBadgeElement component
 *
 * Element component (Layer 1) that displays a badge for an enum-coded value
 * (status, priority, type, category...) from a caller-provided config:
 * variant (color), label and optional tooltip description per code.
 *
 * The config-driven design keeps the element domain-free: the caller owns
 * the code taxonomy and its translations, this element only renders it.
 * Unknown codes fall back to a neutral badge showing the raw code.
 */
const EnumBadgeElement: React.FC<EnumBadgeElementProps> = ({
    code,
    values,
    showTooltip = true,
    tooltipTitle,
    pill,
    size,
    outline,
    className,
    children
}) => {
    const config = resolveValueConfig(values, code);
    const label = config.label ?? code;
    const variant = config.variant ?? "secondary";
    const description = config.description;

    if (showTooltip && description) {
        return (
            <BadgeElement variant={variant} pill={pill} size={size} outline={outline} className={className}>
                <InfoTooltipElement
                    content={description}
                    title={tooltipTitle}
                    placement="top"
                    inheritColor={true}
                >
                    {label}
                </InfoTooltipElement>
                {children}
            </BadgeElement>
        );
    }

    return (
        <BadgeElement variant={variant} pill={pill} size={size} outline={outline} className={className}>
            {label}
            {children}
        </BadgeElement>
    );
};

EnumBadgeElement.displayName = "EnumBadgeElement";

export default EnumBadgeElement;
