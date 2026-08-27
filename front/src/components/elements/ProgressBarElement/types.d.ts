/**
 * Props for the ProgressBarElement component
 */
export interface ProgressBarElementProps {
    /**
     * Progress value (0-100)
     */
    value: number;

    /**
     * Show percentage label inside the bar
     * @default false
     */
    showLabel?: boolean;

    /**
     * Show percentage in a tooltip on hover
     * @default false
     */
    showTooltip?: boolean;

    /**
     * Progress bar variant
     * @default "primary"
     */
    variant?: "primary" | "success" | "info" | "warning" | "danger";

    /**
     * Size of the progress bar
     * @default "md"
     */
    size?: "sm" | "md" | "lg";

    /**
     * Striped style
     * @default false
     */
    striped?: boolean;

    /**
     * Animated stripes
     * @default false
     */
    animated?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;
}