import React from "react";
import {OverlayTrigger, ProgressBar, Tooltip} from "react-bootstrap";
import {ProgressBarElementProps} from "./types";

/**
 * Get variant based on progress value
 */
const getAutoVariant = (value: number): "danger" | "warning" | "info" | "success" => {
    if (value >= 100) return "success";
    if (value >= 75) return "info";
    if (value >= 50) return "warning";
    return "danger";
};

/**
 * ProgressBarElement component
 *
 * Element component (Layer 1) that displays a progress bar with:
 * - Percentage value
 * - Optional label (inside bar or in tooltip)
 * - Auto-colored variant based on progress (if no variant specified)
 */
const ProgressBarElement: React.FC<ProgressBarElementProps> = ({
    value,
    showLabel = false,
    showTooltip = false,
    variant,
    size = "md",
    striped = false,
    animated = false,
    className
}) => {
    const displayVariant = variant || getAutoVariant(value);
    const clampedValue = Math.max(0, Math.min(100, value));

    const sizeStyle = {
        sm: {height: "0.5rem"},
        md: {height: "1rem"},
        lg: {height: "1.5rem"}
    };

    const progressBar = (
        <ProgressBar
            now={clampedValue}
            label={showLabel ? `${clampedValue}%` : undefined}
            variant={displayVariant}
            striped={striped}
            animated={animated}
            style={sizeStyle[size]}
            className={className}
        />
    );

    if (showTooltip) {
        return (
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{clampedValue}%</Tooltip>}
            >
                <div className="w-100">{progressBar}</div>
            </OverlayTrigger>
        );
    }

    return progressBar;
};

ProgressBarElement.displayName = "ProgressBarElement";

export default ProgressBarElement;