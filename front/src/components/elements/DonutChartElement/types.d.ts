export interface DonutChartDataPoint {
    name: string;
    value: number;
    color?: string;
}

export interface DonutChartElementProps {
    data: DonutChartDataPoint[];
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    tooltipFormatter?: (value: number, name: string) => string;
    showLegend?: boolean;
    /** Minimum visual percentage for small segments (e.g. 1). Tooltips still show real values. */
    minPercent?: number;
    className?: string;
}

export interface DonutChartLegendProps {
    data: DonutChartDataPoint[];
    className?: string;
}
