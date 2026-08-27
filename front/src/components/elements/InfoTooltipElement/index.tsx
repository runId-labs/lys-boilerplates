import React from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";
import {InfoTooltipElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * InfoTooltipElement component
 *
 * Element component (Layer 1) that provides:
 * - Small info icon that displays a tooltip on hover
 * - Useful for providing definitions and explanations
 * - Can wrap children or display standalone icon
 *
 * Usage:
 * - Standalone: <InfoTooltipElement content="Definition here" />
 * - With text: <InfoTooltipElement content="Definition">Revenue</InfoTooltipElement>
 */
const InfoTooltipElement: React.FC<InfoTooltipElementProps> = ({
    content,
    title,
    placement = "top",
    size = "sm",
    className,
    inheritColor = false,
    children
}) => {
    const popoverId = `info-tooltip-${Math.random().toString(36).substr(2, 9)}`;

    const popover = (
        <Popover id={popoverId} className="info-tooltip-element__popover">
            {title && <Popover.Header>{title}</Popover.Header>}
            <Popover.Body>{content}</Popover.Body>
        </Popover>
    );

    // If children provided, wrap them with tooltip trigger
    if (children) {
        return (
            <OverlayTrigger
                trigger={["hover", "focus"]}
                placement={placement}
                overlay={popover}
            >
                <span
                    className={cn(
                        "info-tooltip-element",
                        "info-tooltip-element--with-children",
                        inheritColor && "info-tooltip-element--inherit-color",
                        className
                    )}
                    tabIndex={0}
                    role="button"
                    aria-label={title || "More information"}
                >
                    {children}
                    <i
                        className={cn(
                            "bi bi-info-circle",
                            "info-tooltip-element__icon",
                            `info-tooltip-element__icon--${size}`
                        )}
                        aria-hidden="true"
                    />
                </span>
            </OverlayTrigger>
        );
    }

    // Standalone icon mode
    return (
        <OverlayTrigger
            trigger={["hover", "focus"]}
            placement={placement}
            overlay={popover}
        >
            <span
                className={cn(
                    "info-tooltip-element",
                    "info-tooltip-element--standalone",
                    inheritColor && "info-tooltip-element--inherit-color",
                    className
                )}
                tabIndex={0}
                role="button"
                aria-label={title || "More information"}
            >
                <i
                    className={cn(
                        "bi bi-info-circle-fill",
                        "info-tooltip-element__icon",
                        `info-tooltip-element__icon--${size}`
                    )}
                    aria-hidden="true"
                />
            </span>
        </OverlayTrigger>
    );
};

InfoTooltipElement.displayName = "InfoTooltipElement";

export default InfoTooltipElement;