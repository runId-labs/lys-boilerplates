/**
 * Trend direction for variation display
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Trend sentiment (positive/negative interpretation)
 */
export type TrendSentiment = "positive" | "negative" | "neutral";

/**
 * KPICardElement props
 */
export interface KPICardElementProps {
    /**
     * Main value to display (e.g., "496 800 EUR", "9.3 ETP")
     */
    value: string;

    /**
     * Label describing the KPI
     */
    label: string;

    /**
     * Variation text (e.g., "+26.6%", "-27pp")
     */
    variation?: string;

    /**
     * Direction of the trend
     */
    trendDirection?: TrendDirection;

    /**
     * Whether this trend is positive or negative for the business
     * (e.g., turnover going down is positive)
     */
    trendSentiment?: TrendSentiment;

    /**
     * Optional CSS class name
     */
    className?: string;
}
