/**
 * Represents a single data series (line) on the chart
 */
export interface LineChartSeries {
    /** Unique key for this series (used as dataKey) */
    key: string;
    /** Display name for legend */
    name: string;
    /** Line color (CSS variable or hex) */
    color: string;
    /** Whether line is dashed */
    dashed?: boolean;
    /** Line stroke width */
    strokeWidth?: number;
}

/**
 * Data point for the chart - must have the x-axis key and series values
 */
export interface LineChartDataPoint {
    [key: string]: string | number | null;
}

/**
 * Reference line configuration
 */
export interface LineChartReferenceLine {
    /** Y-axis value for horizontal line */
    y: number;
    /** Line color */
    color?: string;
    /** Label text */
    label?: string;
    /** Whether line is dashed */
    dashed?: boolean;
}

/**
 * Reference area (highlighted band on the X-axis range)
 */
export interface LineChartReferenceArea {
    /** Start value on the X-axis */
    x1: string | number;
    /** End value on the X-axis */
    x2: string | number;
    /** Fill color (CSS variable or hex). Defaults to danger. */
    color?: string;
    /** Fill opacity (0-1). Defaults to 0.08. */
    opacity?: number;
    /** Optional label rendered inside the area */
    label?: string;
}

/**
 * Props for LineChartElement
 */
export interface LineChartElementProps {
    /** Array of data points */
    data: LineChartDataPoint[];
    /** Configuration for each line series */
    series: LineChartSeries[];
    /** Key for X-axis values in data points */
    xAxisKey: string;
    /** Custom XAxis tick: React element (cloned by Recharts) or render function. Overrides default. */
    xAxisTick?: React.ReactElement | ((props: {x?: number | string; y?: number | string; payload?: {value: string | number}}) => React.ReactElement);
    /** Recharts XAxis tick interval (0 = every tick, "preserveStart" etc.) */
    xAxisInterval?: number | "preserveStart" | "preserveEnd" | "preserveStartEnd";
    /** Extra bottom padding around the chart (e.g. to fit a multi-line tick) */
    xAxisHeight?: number;
    /** Chart height in pixels */
    height?: number;
    /** Optional Y-axis label formatter */
    yAxisFormatter?: (value: number) => string;
    /** Optional tooltip value formatter */
    tooltipFormatter?: (value: number, seriesKey: string) => string;
    /** Optional tooltip header label formatter (transforms the X-axis value) */
    tooltipLabelFormatter?: (label: string | number) => string;
    /** Custom tooltip component */
    customTooltip?: React.ReactElement;
    /** Reference lines (e.g., average, zero line) */
    referenceLines?: LineChartReferenceLine[];
    /** Reference areas (highlighted X-axis bands) */
    referenceAreas?: LineChartReferenceArea[];
    /** Show legend */
    showLegend?: boolean;
    /** Legend horizontal alignment. Defaults to "center". */
    legendAlign?: "center" | "left" | "right";
    /** Show grid */
    showGrid?: boolean;
    /** Additional class name */
    className?: string;
}
