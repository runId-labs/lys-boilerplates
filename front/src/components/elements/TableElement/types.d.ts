import {ReactNode} from "react";

/**
 * Responsive breakpoint value
 * - number: Bootstrap column size (1-12) for that breakpoint
 * - "d-none": Hide column at that breakpoint
 */
export type BreakpointValue = number | "d-none";

/**
 * Table column configuration with responsive breakpoints
 */
export interface TableColumn {
    /**
     * Key in the data object for this column
     */
    dataName: string;

    /**
     * Column header label (can be translated string or ReactNode)
     */
    label: string | ReactNode;

    /**
     * Optional generator function to customize cell rendering
     * If provided, this function will be used instead of row[dataName]
     */
    generator?: (row: TableRowData) => ReactNode;

    /**
     * Responsive column widths using Bootstrap grid classes
     * - number 1-12: col-{breakpoint}-{number}
     * - "d-none": hide column at this breakpoint
     */
    xs?: BreakpointValue;
    sm?: BreakpointValue;
    md?: BreakpointValue;
    lg?: BreakpointValue;
    xl?: BreakpointValue;
    xxl?: BreakpointValue;
}

/**
 * Table row data (flat object with ReactNode or any other values)
 * ReactNode for display, other types for generator consumption
 */
export type TableRowData = Record<string, unknown>;

/**
 * TableElement component props
 */
export interface TableElementProps {
    /**
     * Column configuration with responsive breakpoints
     */
    columns: TableColumn[];

    /**
     * Table data (array of flat objects)
     * Each object should have keys matching column dataName
     */
    data: TableRowData[];

    /**
     * Optional action generator function
     * Receives row data and returns ReactNode (buttons, dropdowns, etc.)
     */
    actionGenerator?: (row: TableRowData) => ReactNode;

    /**
     * Label for actions column header
     */
    actionColumnLabel?: string | ReactNode;

    /**
     * Responsive breakpoints for actions column
     */
    actionColumnBreakpoints?: {
        xs?: BreakpointValue;
        sm?: BreakpointValue;
        md?: BreakpointValue;
        lg?: BreakpointValue;
        xl?: BreakpointValue;
        xxl?: BreakpointValue;
    };

    /**
     * Optional CSS class for the table
     */
    className?: string;

    /**
     * Enable striped rows (default: true)
     */
    striped?: boolean;

    /**
     * Enable hover effect on rows (default: true)
     */
    hover?: boolean;

    /**
     * Make table bordered (default: false)
     */
    bordered?: boolean;

    /**
     * Make table borderless (default: false)
     */
    borderless?: boolean;

    /**
     * Make table responsive (horizontal scroll on small screens)
     * Default: true
     */
    responsive?: boolean;

    /**
     * Message to display when no data is available
     * Default: "No data available"
     */
    emptyMessage?: string | ReactNode;
}
