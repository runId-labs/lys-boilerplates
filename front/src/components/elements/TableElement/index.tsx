import React, {useMemo, ReactNode} from "react";
import {Table} from "react-bootstrap";
import {TableElementProps, TableColumn, BreakpointValue} from "./types";
import {useTableElementTranslations} from "./translations";
import "./styles.scss";

/**
 * Generate Bootstrap responsive classes for a column
 * @param column - Column configuration with breakpoints
 * @returns CSS class string
 */
const getColumnClasses = (column: TableColumn | TableElementProps["actionColumnBreakpoints"]): string => {
    const classes: string[] = [];
    const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

    // First pass: find first visible breakpoint (to handle d-none properly)
    let firstVisibleBreakpoint: string | null = null;
    let hasHiddenBefore = false;

    for (const breakpoint of breakpoints) {
        const value = column?.[breakpoint] as BreakpointValue | undefined;

        if (value === "d-none") {
            if (!firstVisibleBreakpoint) {
                hasHiddenBefore = true;
            }
        } else if (typeof value === "number") {
            if (!firstVisibleBreakpoint) {
                firstVisibleBreakpoint = breakpoint;
            }
        }
    }

    // Second pass: generate classes
    breakpoints.forEach(breakpoint => {
        const value = column?.[breakpoint] as BreakpointValue | undefined;

        if (value === undefined) return;

        if (value === "d-none") {
            // Only add d-none on the first hidden breakpoint if there's a visible one later
            if (breakpoint === "xs" && hasHiddenBefore && firstVisibleBreakpoint) {
                classes.push("d-none");
            } else if (breakpoint !== "xs") {
                classes.push(`d-${breakpoint}-none`);
            }
        } else if (typeof value === "number") {
            // If this is the first visible breakpoint and we had hidden before, add d-{breakpoint}-block
            if (breakpoint === firstVisibleBreakpoint && hasHiddenBefore) {
                const displayClass = breakpoint === "xs" ? "d-block" : `d-${breakpoint}-block`;
                classes.push(displayClass);
            }

            // Column width at this breakpoint
            const prefix = breakpoint === "xs" ? "col" : `col-${breakpoint}`;
            classes.push(`${prefix}-${value}`);
        }
    });

    return classes.join(" ");
};

/**
 * TableElement component
 *
 * Element component (Layer 1) that provides:
 * - Generic responsive table with Bootstrap grid-based columns
 * - Configurable column visibility per breakpoint
 * - Support for ReactNode cell content
 * - Optional action column with generator function
 *
 * This is an element component (Layer 1) that:
 * - Receives flat data (no GraphQL knowledge)
 * - Provides responsive column configuration
 * - Supports custom rendering via ReactNode
 * - Reusable across different data types
 */
const TableElement: React.FC<TableElementProps> = ({
    columns,
    data,
    actionGenerator,
    actionColumnLabel,
    actionColumnBreakpoints = {xs: 2, md: 2, lg: 1},
    className = "",
    striped = true,
    hover = true,
    bordered = false,
    borderless = false,
    responsive = true,
    emptyMessage
}) => {
    const {t} = useTableElementTranslations();

    const resolvedActionColumnLabel = actionColumnLabel ?? t("actions");
    const resolvedEmptyMessage = emptyMessage ?? t("noData");
    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Pre-compute column classes
     */
    const columnClasses = useMemo(() => {
        return columns.map(col => getColumnClasses(col));
    }, [columns]);

    /**
     * Action column classes
     */
    const actionClasses = useMemo(() => {
        return actionGenerator ? getColumnClasses(actionColumnBreakpoints || {}) : "";
    }, [actionGenerator, actionColumnBreakpoints]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    const tableContent = (
        <Table
            striped={striped}
            hover={hover}
            bordered={bordered}
            borderless={borderless}
            className={`table-element ${className}`}
        >
            <thead>
                <tr className="row">
                    {columns.map((column, index) => (
                        <th key={column.dataName} className={columnClasses[index]}>
                            {column.label}
                        </th>
                    ))}
                    {actionGenerator && (
                        <th className={actionClasses}>
                            {resolvedActionColumnLabel}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr className="row">
                        <td colSpan={columns.length + (actionGenerator ? 1 : 0)} className="text-center text-muted py-5">
                            {resolvedEmptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="row">
                            {columns.map((column, colIndex) => (
                                <td key={column.dataName} className={columnClasses[colIndex]}>
                                    {column.generator ? column.generator(row) : row[column.dataName] as ReactNode}
                                </td>
                            ))}
                            {actionGenerator && (
                                <td className={`${actionClasses} table-element__actions`}>
                                    {actionGenerator(row)}
                                </td>
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    return responsive ? (
        <div className="table-responsive table-element-wrapper">
            {tableContent}
        </div>
    ) : tableContent;
};

TableElement.displayName = "TableElement";

export default TableElement;
