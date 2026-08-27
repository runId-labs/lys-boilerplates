import React, {useMemo} from "react";
import {useIntl} from "react-intl";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {DonutChartElementProps, DonutChartLegendProps, DonutChartDataPoint} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

export const DONUT_COLORS = [
    "var(--bs-primary)",
    "var(--bs-info)",
    "var(--bs-success)",
    "var(--bs-warning)",
    "var(--lys-color-text-muted)",
    "var(--bs-danger)",
    "var(--bs-dark)",
    "var(--bs-indigo, #6610f2)"
];

const defaultTooltipFormatter = (locale: string, value: number): string => {
    return new Intl.NumberFormat(locale, {maximumFractionDigits: 0}).format(value);
};

/**
 * Adjust data so that small segments meet a minimum visual percentage.
 * Returns display data (for rendering) while preserving original values for tooltips.
 */
export const applyMinPercent = (
    data: DonutChartDataPoint[],
    minPercent: number
): {displayValue: number; originalValue: number; name: string; color?: string}[] => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return data.map(d => ({...d, displayValue: d.value, originalValue: d.value}));

    const minValue = (minPercent / 100) * total;

    return data.map(d => ({
        ...d,
        originalValue: d.value,
        displayValue: d.value > 0 && d.value < minValue ? minValue : d.value
    }));
};

const DonutChartElement: React.FC<DonutChartElementProps> = ({
    data,
    height = 280,
    innerRadius = 60,
    outerRadius = 100,
    tooltipFormatter,
    showLegend = true,
    minPercent = 1,
    className
}) => {
    const {locale} = useIntl();

    const total = data.reduce((sum, d) => sum + d.value, 0);

    const chartData = useMemo(() => applyMinPercent(data, minPercent), [data, minPercent]);

    return (
        <div className={cn("donut-chart-element", className)}>
            <ResponsiveContainer width="100%" height={height} minWidth={0} debounce={50}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        dataKey="displayValue"
                        nameKey="name"
                        paddingAngle={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || DONUT_COLORS[index % DONUT_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bs-body-bg)",
                            border: "1px solid var(--bs-border-color)",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem"
                        }}
                        formatter={(_value, name, props) => {
                            const originalValue = props.payload?.originalValue as number;
                            const percent = total > 0 ? ((originalValue / total) * 100).toFixed(1) : "0.0";
                            const formatted = tooltipFormatter
                                ? tooltipFormatter(originalValue, name as string)
                                : defaultTooltipFormatter(locale, originalValue);
                            return [`${formatted} (${percent}%)`, name];
                        }}
                    />
                    {showLegend && (
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

DonutChartElement.displayName = "DonutChartElement";

/**
 * Standalone legend for DonutChartElement, usable outside the chart (e.g. in CardElement footer).
 * Uses the same color logic as the chart.
 */
export const DonutChartLegend: React.FC<DonutChartLegendProps> = ({data, className}) => (
    <div className={cn("donut-chart-legend", className)}>
        {data.map((item, index) => (
            <div key={item.name} className="donut-chart-legend__item">
                <span
                    className="donut-chart-legend__dot"
                    style={{backgroundColor: item.color || DONUT_COLORS[index % DONUT_COLORS.length]}}
                />
                {item.name}
            </div>
        ))}
    </div>
);

DonutChartLegend.displayName = "DonutChartLegend";

export default DonutChartElement;
