import {ReactNode} from "react";

/**
 * Relay PageInfo structure (from GraphQL connections)
 */
export interface RelayPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
    totalCount?: number | null;
}

/**
 * Pagination change event data
 */
export interface PaginationChangeEvent {
    /**
     * Page size for forward pagination (with `after`). Null on a backward page.
     */
    first?: number | null;

    /**
     * Page size for backward pagination (with `before`). Null on a forward page.
     */
    last?: number | null;

    /**
     * Cursor for next page (forward pagination).
     */
    after?: string | null;

    /**
     * Cursor for previous page (backward pagination).
     */
    before?: string | null;
}

/**
 * PaginationElement component props
 */
export interface PaginationElementProps {
    /**
     * Relay PageInfo from GraphQL connection
     */
    pageInfo: RelayPageInfo;

    /**
     * Current number of items per page
     */
    itemsPerPage: number;

    /**
     * Available items per page options
     * Default: [10, 25, 50, 100]
     */
    itemsPerPageOptions?: number[];

    /**
     * Current number of items being displayed
     */
    currentItemCount: number;

    /**
     * Callback when pagination changes (next/previous or items per page change)
     */
    onPaginationChange: (event: PaginationChangeEvent) => void;

    /**
     * CSS class for the pagination container
     */
    className?: string;

    /**
     * Align pagination controls
     * Default: "center"
     */
    align?: "start" | "center" | "end";

    /**
     * Show items per page selector
     * Default: true
     */
    showItemsPerPage?: boolean;

    /**
     * Show "Showing X-Y of Total" text
     * Default: true
     */
    showItemCount?: boolean;
}
