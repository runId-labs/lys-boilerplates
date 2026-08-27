import React, {useRef, useState, useEffect, useCallback} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {TruncatedTextElementProps} from "./types";
import {cn} from "lys-front/tools";

/**
 * TruncatedTextElement component
 *
 * Element component (Layer 1) that provides:
 * - Text with ellipsis truncation
 * - Tooltip showing full text only when truncated
 * - Automatic detection of truncation state
 *
 * Usage:
 * <TruncatedTextElement text="Very long text that might be truncated" />
 */
const TruncatedTextElement: React.FC<TruncatedTextElementProps> = ({
    text,
    className,
    placement = "top"
}) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    /**
     * Check if text is truncated by comparing scrollWidth with clientWidth
     */
    const checkTruncation = useCallback(() => {
        if (textRef.current) {
            const {scrollWidth, clientWidth} = textRef.current;
            setIsTruncated(scrollWidth > clientWidth);
        }
    }, []);

    /**
     * Check truncation on mount and when text changes
     */
    useEffect(() => {
        checkTruncation();

        // Also check on window resize
        window.addEventListener("resize", checkTruncation);
        return () => window.removeEventListener("resize", checkTruncation);
    }, [text, checkTruncation]);

    const textElement = (
        <span
            ref={textRef}
            className={cn("truncated-text-element", className)}
            style={{
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}
        >
            {text}
        </span>
    );

    // Only show tooltip if text is truncated
    if (!isTruncated) {
        return textElement;
    }

    return (
        <OverlayTrigger
            trigger={["hover", "focus"]}
            placement={placement}
            overlay={
                <Tooltip id={`truncated-tooltip-${text.slice(0, 10)}`}>
                    {text}
                </Tooltip>
            }
        >
            {textElement}
        </OverlayTrigger>
    );
};

TruncatedTextElement.displayName = "TruncatedTextElement";

export default TruncatedTextElement;