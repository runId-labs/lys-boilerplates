import {ReactNode} from "react";

// The connection shapes are the framework's: a page of a Relay connection looks the same
// in every application, only the pager rendering it is this project's.
export type {RelayPageInfo, PaginationChangeEvent} from "lys-front/types";
import type {RelayPageInfo, PaginationChangeEvent} from "lys-front/types";

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
