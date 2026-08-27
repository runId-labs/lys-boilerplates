import React from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";
import BadgeElement from "@/components/elements/BadgeElement";
import {CountBadgeElementProps} from "./types";
import {cn} from "lys-front/tools";

/**
 * CountBadgeElement component
 *
 * Element component (Layer 1) that provides:
 * - Display count of items with optional hover popover
 * - Generic reusable component for any list of items
 * - Consistent styling with application's BadgeElement
 *
 * This is an element component (Layer 1) that:
 * - Has no business logic
 * - Receives all data via props
 * - Can be used for roles, tags, categories, or any list
 * - Provides consistent UI for count badges with optional details
 */
const CountBadgeElement: React.FC<CountBadgeElementProps> = ({
    items,
    popoverTitle,
    showPopover = true,
    popoverId,
    variant = "secondary",
    emptyDisplay = "-",
    className
}) => {
    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (!items || items.length === 0) {
        return <>{emptyDisplay}</>;
    }

    const countBadge = (
        <BadgeElement
            variant={variant}
            pill
            size="sm"
            className={cn(
                "count-badge-element",
                className
            )}
        >
            {items.length}
        </BadgeElement>
    );

    if (!showPopover) {
        return countBadge;
    }

    const popover = (
        <Popover id={popoverId || `count-badge-popover-${Math.random()}`}>
            {popoverTitle && <Popover.Header>{popoverTitle}</Popover.Header>}
            <Popover.Body>
                <ul className="list-unstyled mb-0 small">
                    {items.map((item, index) => (
                        <li key={index} className="py-1">
                            {item}
                        </li>
                    ))}
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={popover}>
            <span className="d-inline-block cursor-pointer">
                {countBadge}
            </span>
        </OverlayTrigger>
    );
};

CountBadgeElement.displayName = "CountBadgeElement";

export default CountBadgeElement;