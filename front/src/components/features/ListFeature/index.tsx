import React from "react";
import {ListFeatureProps} from "./types";
import TableElement from "@/components/elements/TableElement";
import PaginationElement from "@/components/elements/PaginationElement";

/**
 * ListFeature component
 *
 * Generic feature component (Layer 2) for displaying lists
 * - Pure presentation component
 * - No GraphQL logic
 * - Reusable for any type of data (users, clients, products, etc.)
 *
 * Usage:
 * - Define columns specific to your data type
 * - Transform your data to TableRowData format
 * - Pass to this component for rendering
 */
const ListFeature: React.FC<ListFeatureProps> = ({
    columns,
    data,
    actionGenerator,
    actionColumnLabel = "Actions",
    pageInfo,
    itemsPerPage = 50,
    emptyMessage = "No data found",
    onPaginationChange
}) => {
    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <>
            <TableElement
                columns={columns}
                data={data}
                actionGenerator={actionGenerator}
                actionColumnLabel={actionColumnLabel}
                actionColumnBreakpoints={{
                    xs: 3,
                    sm: 2,
                    md: 2,
                    lg: 1,
                    xl: 1
                }}
                emptyMessage={emptyMessage}
            />

            {/* Pagination Controls */}
            {pageInfo && onPaginationChange && (
                <PaginationElement
                    pageInfo={pageInfo}
                    itemsPerPage={itemsPerPage}
                    currentItemCount={data.length}
                    onPaginationChange={onPaginationChange}
                />
            )}
        </>
    );
};

ListFeature.displayName = "ListFeature";

export default ListFeature;