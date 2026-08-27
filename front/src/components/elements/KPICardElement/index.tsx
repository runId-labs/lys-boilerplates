import React from "react";
import {KPICardElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * KPICardElement component
 *
 * Element component (Layer 1) that provides:
 * - Display of a single KPI with value, label, and variation
 * - Trend indicator with arrow and color coding
 * - Compact card layout for dashboard grids
 */
const KPICardElement: React.FC<KPICardElementProps> = ({
    value,
    label,
    variation,
    trendDirection = "neutral",
    trendSentiment = "neutral",
    className
}) => {
    const getTrendIcon = () => {
        switch (trendDirection) {
            case "up":
                return <i className="bi bi-arrow-up" />;
            case "down":
                return <i className="bi bi-arrow-down" />;
            default:
                return <i className="bi bi-dash" />;
        }
    };

    return (
        <div className={cn("kpi-card-element", className)}>
            <div className="kpi-card-element__value">{value}</div>
            <div className="kpi-card-element__label">{label}</div>
            <div className={cn(
                "kpi-card-element__variation",
                `kpi-card-element__variation--${variation ? trendSentiment : "neutral"}`
            )}>
                {variation ? getTrendIcon() : null}
                <span>{variation || "-"}</span>
            </div>
        </div>
    );
};

KPICardElement.displayName = "KPICardElement";

export default KPICardElement;
