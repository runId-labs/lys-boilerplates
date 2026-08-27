import {ReactNode} from "react";
import {TableColumn, TableRowData} from "@/components/elements/TableElement/types";

/**
 * ListFeature props
 * Generic list display component that can be used for any type of data
 */
export interface ListFeatureProps {
    /**
     * Table columns configuration
     */
    columns: TableColumn[];

    /**
     * Table row data
     */
    data: TableRowData[];

    /**
     * Custom action generator for each row
     */
    actionGenerator?: (row: TableRowData) => ReactNode;

    /**
     * Action column label
     */
    actionColumnLabel?: string;

    /**
     * Pagination info from GraphQL query
     */
    pageInfo?: {
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: string | null | undefined;
        readonly endCursor: string | null | undefined;
        readonly totalCount?: number | null;
    };

    /**
     * Items per page for pagination
     */
    itemsPerPage?: number;

    /**
     * Empty message
     */
    emptyMessage?: string;

    /**
     * Pagination change handler
     */
    onPaginationChange?: (event: {first?: number | null; last?: number | null; after?: string | null; before?: string | null}) => void;
}