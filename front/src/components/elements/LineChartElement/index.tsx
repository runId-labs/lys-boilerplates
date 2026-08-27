import React from "react";
import {useIntl} from "react-intl";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine,
    Legend
} from "recharts";
import {LineChartElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * Default Y-axis formatter (compact currency)
 */
const defaultYAxisFormatter = (value: number): string => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`;
    }
    if (value === 0) {
        return "0";
    }
    if (Math.abs(value) < 1) {
        return value.toFixed(1);
    }
    return value.toFixed(0);
};

/**
 * Default tooltip formatter (locale-aware)
 */
const defaultTooltipFormatter = (locale: string, value: number): string => {
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1
    }).format(value);
};

/**
 * LineChartElement component
 *
 * Element component (Layer 1) that renders a responsive line chart using recharts.
 * Supports multiple series, reference lines, custom formatters, and legends.
 */
const LineChartElement: React.FC<LineChartElementProps> = ({
    data,
    series,
    xAxisKey,
    xAxisTick,
    xAxisInterval,
    xAxisHeight,
    height = 200,
    yAxisFormatter = defaultYAxisFormatter,
    tooltipFormatter,
    tooltipLabelFormatter,
    customTooltip,
    referenceLines = [],
    referenceAreas = [],
    showLegend = true,
    showGrid = true,
    legendAlign = "center",
    className
}) => {
    const {locale} = useIntl();

    const resolvedTooltipFormatter = tooltipFormatter
        ?? ((value: number) => defaultTooltipFormatter(locale, value));

    return (
        <div className={cn("line-chart-element", className)} style={{height}}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                <LineChart
                    data={data}
                    margin={{top: 10, right: 10, left: 0, bottom: 0}}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--bs-border-color)"
                        />
                    )}

                    <XAxis
                        dataKey={xAxisKey}
                        tick={xAxisTick ?? {fontSize: 12}}
                        interval={xAxisInterval ?? "preserveStartEnd"}
                        height={xAxisHeight}
                        stroke="var(--lys-color-text-muted)"
                        tickLine={{stroke: "var(--bs-border-color)"}}
                    />

                    <YAxis
                        tickFormatter={yAxisFormatter}
                        tick={{fontSize: 12}}
                        stroke="var(--lys-color-text-muted)"
                        tickLine={{stroke: "var(--bs-border-color)"}}
                        width={55}
                    />

                    {customTooltip ? (
                        <Tooltip content={customTooltip} />
                    ) : (
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--bs-body-bg)",
                                border: "1px solid var(--bs-border-color)",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem"
                            }}
                            labelStyle={{
                                fontWeight: 600,
                                marginBottom: "0.25rem"
                            }}
                            labelFormatter={
                                tooltipLabelFormatter
                                    ? (label) => tooltipLabelFormatter(label as string | number)
                                    : undefined
                            }
                            formatter={(value, name) => {
                                const seriesConfig = series.find(s => s.key === name);
                                return [resolvedTooltipFormatter(value as number, name as string), seriesConfig?.name || name];
                            }}
                        />
                    )}

                    {/* Reference areas (highlighted X-axis bands) — rendered before lines to sit behind */}
                    {referenceAreas.map((area, index) => (
                        <ReferenceArea
                            key={`area-${index}`}
                            x1={area.x1}
                            x2={area.x2}
                            fill={area.color || "var(--bs-danger)"}
                            fillOpacity={area.opacity ?? 0.08}
                            stroke="none"
                            label={area.label ? {
                                value: area.label,
                                position: "insideTop",
                                fontSize: 11,
                                fill: "var(--bs-secondary-color)"
                            } : undefined}
                        />
                    ))}

                    {/* Reference lines (zero line, average, etc.) */}
                    {referenceLines.map((refLine, index) => (
                        <ReferenceLine
                            key={`ref-${index}`}
                            y={refLine.y}
                            stroke={refLine.color || "var(--lys-color-text-muted)"}
                            strokeDasharray={refLine.dashed !== false ? "5 5" : undefined}
                            strokeWidth={1}
                            label={refLine.label ? {
                                value: refLine.label,
                                position: "right",
                                fontSize: 11,
                                fill: "var(--bs-secondary-color)"
                            } : undefined}
                        />
                    ))}

                    {/* Data series lines */}
                    {series.map((s) => (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.key}
                            stroke={s.color}
                            strokeWidth={s.strokeWidth || 2}
                            strokeDasharray={s.dashed ? "6 4" : undefined}
                            dot={{
                                fill: s.color,
                                strokeWidth: 0,
                                r: 4
                            }}
                            activeDot={{
                                r: 6,
                                fill: s.color,
                                stroke: "white",
                                strokeWidth: 2
                            }}
                            connectNulls={false}
                        />
                    ))}

                    {showLegend && (
                        <Legend
                            verticalAlign="bottom"
                            align={legendAlign}
                            height={36}
                            iconType="line"
                            formatter={(value: string) => {
                                const seriesConfig = series.find(s => s.key === value);
                                return seriesConfig?.name || value;
                            }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

LineChartElement.displayName = "LineChartElement";

export default LineChartElement;
