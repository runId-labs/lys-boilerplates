import React from "react";
import {Accordion} from "react-bootstrap";
import {AccordionElementProps} from "./types";
import {cn} from "lys-front/tools";
import InfoTooltipElement from "@/components/elements/InfoTooltipElement";
import "./styles.scss";

/**
 * AccordionElement component
 *
 * Element component (Layer 1) that provides:
 * - Collapsible sections from a list of items
 * - Optional count badge (grey, rounded) to the right of each title
 * - Multi-open support (alwaysOpen, default true)
 * - Flush variant for borderless embedding
 */
const AccordionElement: React.FC<AccordionElementProps> = ({
    items,
    defaultActiveKeys = [],
    alwaysOpen = true,
    flush = false,
    className
}) => {

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (items.length === 0) return null;

    return (
        <Accordion
            // react-bootstrap expects string[] in alwaysOpen mode, a single string otherwise.
            defaultActiveKey={alwaysOpen ? defaultActiveKeys : defaultActiveKeys[0]}
            alwaysOpen={alwaysOpen}
            flush={flush}
            className={cn("accordion-element", className)}
        >
            {items.map((item) => (
                <Accordion.Item key={item.key} eventKey={item.key}>
                    <Accordion.Header>
                        <div className="accordion-element__header">
                            {item.description ? (
                                <InfoTooltipElement
                                    content={item.description}
                                    placement="top"
                                >
                                    <span className="accordion-element__title">{item.title}</span>
                                </InfoTooltipElement>
                            ) : (
                                <span className="accordion-element__title">{item.title}</span>
                            )}
                            {item.count != null && (
                                <span className="accordion-element__count-badge">
                                    {item.count}
                                </span>
                            )}
                            {item.extraTitle != null && (
                                <span className="accordion-element__extra">{item.extraTitle}</span>
                            )}
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>{item.body}</Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};

AccordionElement.displayName = "AccordionElement";

export default AccordionElement;
