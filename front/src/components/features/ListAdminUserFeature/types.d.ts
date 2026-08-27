import {ReactNode} from "react";
import {TableRowData} from "@/components/elements/TableElement/types";

/**
 * ListAdminUserFeature props (container component)
 */
export interface ListAdminUserFeatureProps {
    /**
     * Admin users fragment reference from parent query
     */
    adminUsersFragmentRef: any;

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
    itemsPerPage: number;

    /**
     * Custom action generator for each row
     */
    actionGenerator?: (row: TableRowData) => ReactNode;

    /**
     * Pagination change handler
     */
    onPaginationChange?: (event: {first?: number | null; last?: number | null; after?: string | null; before?: string | null}) => void;
}