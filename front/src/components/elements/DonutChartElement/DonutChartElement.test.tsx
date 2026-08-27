import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import {applyMinPercent, DonutChartLegend, DONUT_COLORS} from "./index";

describe("applyMinPercent", () => {
    it("preserves original values when all segments are above minimum", () => {
        const data = [
            {name: "A", value: 50},
            {name: "B", value: 50}
        ];
        const result = applyMinPercent(data, 1);

        expect(result).toHaveLength(2);
        expect(result[0].displayValue).toBe(50);
        expect(result[0].originalValue).toBe(50);
        expect(result[1].displayValue).toBe(50);
        expect(result[1].originalValue).toBe(50);
    });

    it("bumps small segments to minimum visual percentage", () => {
        const data = [
            {name: "Base", value: 236328},
            {name: "Overtime", value: 72},
            {name: "Benefits", value: 12800}
        ];
        const result = applyMinPercent(data, 1);
        const total = 236328 + 72 + 12800;
        const minValue = total * 0.01;

        // Overtime (72) is below 1% of total (~2492), should be bumped
        expect(result[1].originalValue).toBe(72);
        expect(result[1].displayValue).toBe(minValue);

        // Base and Benefits are above minimum, unchanged
        expect(result[0].displayValue).toBe(236328);
        expect(result[2].displayValue).toBe(12800);
    });

    it("handles zero total without division error", () => {
        const data = [
            {name: "A", value: 0},
            {name: "B", value: 0}
        ];
        const result = applyMinPercent(data, 1);

        expect(result).toHaveLength(2);
        expect(result[0].displayValue).toBe(0);
        expect(result[1].displayValue).toBe(0);
    });

    it("does not bump zero-value segments", () => {
        const data = [
            {name: "A", value: 100},
            {name: "B", value: 0}
        ];
        const result = applyMinPercent(data, 1);

        // Zero stays zero (filtered out in widgets, but should not be inflated)
        expect(result[1].displayValue).toBe(0);
        expect(result[1].originalValue).toBe(0);
    });

    it("handles single segment", () => {
        const data = [{name: "Only", value: 1000}];
        const result = applyMinPercent(data, 5);

        expect(result).toHaveLength(1);
        expect(result[0].displayValue).toBe(1000);
        expect(result[0].originalValue).toBe(1000);
    });

    it("preserves color property", () => {
        const data = [
            {name: "A", value: 100, color: "var(--bs-primary)"},
            {name: "B", value: 1, color: "var(--bs-danger)"}
        ];
        const result = applyMinPercent(data, 5);

        expect(result[0].color).toBe("var(--bs-primary)");
        expect(result[1].color).toBe("var(--bs-danger)");
    });

    it("handles empty data array", () => {
        const result = applyMinPercent([], 1);
        expect(result).toHaveLength(0);
    });
});

describe("DonutChartLegend", () => {
    it("renders all items from data", () => {
        const data = [
            {name: "Resignation", value: 5, color: "var(--bs-warning)"},
            {name: "Dismissal", value: 3, color: "var(--bs-danger)"},
            {name: "Retirement", value: 2, color: "var(--bs-success)"}
        ];
        render(<DonutChartLegend data={data} />);

        expect(screen.getByText("Resignation")).toBeInTheDocument();
        expect(screen.getByText("Dismissal")).toBeInTheDocument();
        expect(screen.getByText("Retirement")).toBeInTheDocument();
    });

    it("renders colored dots with explicit colors", () => {
        const data = [
            {name: "A", value: 10, color: "var(--bs-primary)"},
            {name: "B", value: 20, color: "var(--bs-danger)"}
        ];
        render(<DonutChartLegend data={data} />);

        const dots = document.querySelectorAll(".donut-chart-legend__dot");
        expect(dots).toHaveLength(2);
        expect(dots[0]).toHaveStyle({backgroundColor: "var(--bs-primary)"});
        expect(dots[1]).toHaveStyle({backgroundColor: "var(--bs-danger)"});
    });

    it("falls back to DONUT_COLORS when no color specified", () => {
        const data = [
            {name: "A", value: 10},
            {name: "B", value: 20}
        ];
        render(<DonutChartLegend data={data} />);

        const dots = document.querySelectorAll(".donut-chart-legend__dot");
        expect(dots[0]).toHaveStyle({backgroundColor: DONUT_COLORS[0]});
        expect(dots[1]).toHaveStyle({backgroundColor: DONUT_COLORS[1]});
    });

    it("applies custom className", () => {
        const data = [{name: "A", value: 10}];
        render(<DonutChartLegend data={data} className="custom-legend" />);

        expect(document.querySelector(".donut-chart-legend.custom-legend")).toBeInTheDocument();
    });

    it("renders empty when data is empty", () => {
        render(<DonutChartLegend data={[]} />);

        const container = document.querySelector(".donut-chart-legend");
        expect(container).toBeInTheDocument();
        expect(container?.children).toHaveLength(0);
    });

    it("wraps DONUT_COLORS for many items", () => {
        const data = Array.from({length: DONUT_COLORS.length + 1}, (_, i) => ({
            name: `Item ${i}`,
            value: 10
        }));
        render(<DonutChartLegend data={data} />);

        const dots = document.querySelectorAll(".donut-chart-legend__dot");
        // Last item should wrap to first color
        expect(dots[DONUT_COLORS.length]).toHaveStyle({
            backgroundColor: DONUT_COLORS[0]
        });
    });
});
