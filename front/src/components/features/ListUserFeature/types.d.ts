import {ReactNode} from "react";
import {TableRowData} from "@/components/elements/TableElement/types";

/**
 * Normalized user data structure for display
 * This is the common format used by the presentation component
 */
export interface NormalizedUserData {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    statusCode: string;
    roles: Array<{
        id: string;
        code: string;
    }>;
    createdAt: string;
    clientName?: string; // Optional, only for client users
}

/**
 * ListUserFeature props (presentation component)
 */
export interface ListUserFeatureProps {
    /**
     * Normalized users data (already transformed by container)
     */
    users: NormalizedUserData[];

    /**
     * Pagination info from GraphQL query
     */
    pageInfo?: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string | null;
        endCursor: string | null;
        totalCount?: number;
    };

    /**
     * Items per page for pagination
     */
    itemsPerPage: number;
    /**
     * Custom action generator for each row
     */
    actionGenerator?: (row: TableRowData) => ReactNode;

    /**
     * Show client column (for client users)
     */
    showClientColumn?: boolean;

    /**
     * Pagination change handler
     */
    onPaginationChange?: (event: {first?: number | null; last?: number | null; after?: string | null; before?: string | null}) => void;
}