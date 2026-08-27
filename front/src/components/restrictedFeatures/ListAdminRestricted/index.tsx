import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {ListAdminRestrictedProps} from "./types";
import {getAdminListSearchFilterConfig} from "./config";
import {useListAdminRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useUrlQueries} from "lys-front/providers";
import SearchFilterFeature from "@/components/features/SearchFilterFeature";
import ListAdminUserFeature from "@/components/features/ListAdminUserFeature";
import ShowActionsFeature from "@/components/features/ShowActionsFeature";
import GetAdminRestricted from "@/components/restrictedFeatures/GetAdminRestricted";
import {useCreateUserRestrictedAction} from "@/components/restrictedFeatures/CreateUserRestricted/hooks";
import type {ListAdminRestrictedQuery} from "./__generated__/ListAdminRestrictedQuery.graphql";
import {TableRowData} from "@/components/elements/TableElement/types";

/**
 * GraphQL query for all users list with pagination support
 */
const AllUsersQuery = graphql`
    query ListAdminRestrictedQuery(
        $search: String
        $isClientUser: Boolean
        $roleCode: String
        $orderBy: UserNodeOderByType
        $first: Int
        $last: Int
        $after: String
        $before: String
    ) {
        allUsers(
            search: $search
            isClientUser: $isClientUser
            roleCode: $roleCode
            orderBy: $orderBy
            first: $first
            last: $last
            after: $after
            before: $before
        ) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
                totalCount
            }
            edges {
                node {
                    ...ListUserFeatureFragment_user
                }
            }
        }
    }
`;

/**
 * ListAdminRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected admin/internal user list access
 * - GraphQL query via LysQueryProvider for allUsers (isClientUser: false)
 * - Search and filter functionality via SearchFilterFeature
 * - URL-synchronized filters and sorting
 *
 * This is a restricted feature component (Layer 3) that:
 * - Manages permissions and query loading
 * - Delegates UI rendering to ListAdminUserFeature (container)
 * - Provides search/filter capabilities
 */
const ListAdminRestricted: React.FC<ListAdminRestrictedProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useListAdminRestrictedTranslations();
    const {appliedParams, update: updateUrlQueries} = useUrlQueries();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListAdminRestrictedQuery> | null>(null);

    /**
     * Create user action hook
     * Uses a callback that will access the current queryRef via closure
     */
    const createUserAction = useCreateUserRestrictedAction({
        onCompleted: () => {
            // Refresh the list after successful creation
            queryRef?.load();
        }
    });

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Extract individual URL parameter values
     */
    const searchParam = appliedParams.get("search");
    const roleCodeParam = appliedParams.get("roleCode");
    const orderByParam = appliedParams.get("orderBy");
    const orderDirParam = appliedParams.get("orderDir");
    const firstParam = appliedParams.get("first");
    const lastParam = appliedParams.get("last");
    const afterParam = appliedParams.get("after");
    const beforeParam = appliedParams.get("before");

    /**
     * Get translated search filter configuration
     */
    const adminListSearchFilterConfig = useMemo(() => getAdminListSearchFilterConfig(t), [t]);

    /**
     * Transform URL parameters to GraphQL variables
     * Handles @oneOf orderBy format: {field: boolean} where true=ASC, false=DESC
     * isClientUser is hardcoded to false (internal users/admins only)
     * roleCode filters users by specific role
     * Pagination: first, after, before from URL
     */
    const queryVariables = useMemo(() => {
        const orderByKey = orderByParam || adminListSearchFilterConfig.defaultSort;
        const orderDir = orderDirParam || adminListSearchFilterConfig.defaultSortDirection;
        const first = firstParam ? parseInt(firstParam, 10) : (lastParam ? null : 50);
        const last = lastParam ? parseInt(lastParam, 10) : null;

        return {
            search: searchParam || null,
            isClientUser: false,
            roleCode: roleCodeParam || null,
            orderBy: orderByKey ? {[orderByKey]: orderDir === "ASC"} : null,
            first,
            last,
            after: afterParam || null,
            before: beforeParam || null
        };
    }, [searchParam, roleCodeParam, orderByParam, orderDirParam, firstParam, lastParam, afterParam, beforeParam, adminListSearchFilterConfig]);

    /**
     * Extract admin users fragment ref from query data
     */
    const adminUsersFragmentRef = useMemo(() => {
        if (!queryRef?.data?.allUsers?.edges) return [];
        return queryRef.data.allUsers.edges.map(edge => edge.node);
    }, [queryRef?.data]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Load query when ref is ready and has permission
     * Reload when queryVariables change
     */
    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading) {
            queryRef?.load();
        }
    }, [queryVariables, queryRef?.hasPermission, queryRef?.load]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle parameter changes from SearchFilterFeature
     * Triggers reload via queryVariables dependency in useEffect
     */
    const handleParametersChange = () => {
        // Query reload is handled by useEffect when queryVariables change
    };

    /**
     * Generate action button for each row
     */
    const generateRowActions = (row: TableRowData) => {
        return (
            <GetAdminRestricted
                userId={row.id as string}
                buttonText={<i className="bi bi-eye" />}
                buttonVariant="outline-secondary"
                buttonSize="sm"
            />
        );
    };

    /**
     * Handle pagination changes (next/previous, items per page)
     */
    const handlePaginationChange = (event: {first?: number | null; last?: number | null; after?: string | null; before?: string | null}) => {
        // Update URL parameters for pagination
        updateUrlQueries({
            first: event.first != null ? String(event.first) : null,
            last: event.last != null ? String(event.last) : null,
            after: event.after || null,
            before: event.before || null
        });
    };

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={AllUsersQuery}
            parameters={queryVariables}
            ref={setQueryRef}
        >
            <SearchFilterFeature
                {...adminListSearchFilterConfig}
                onParametersChange={handleParametersChange}
                actions={
                    <ShowActionsFeature
                        primaryAction={createUserAction}
                    />
                }
            >
                {/* User List - delegated to ListAdminUserFeature */}
                {queryRef?.data && (
                    <ListAdminUserFeature
                        adminUsersFragmentRef={adminUsersFragmentRef}
                        pageInfo={queryRef.data.allUsers?.pageInfo}
                        itemsPerPage={queryVariables.first ?? queryVariables.last ?? 50}
                        actionGenerator={generateRowActions}
                        onPaginationChange={handlePaginationChange}
                    />
                )}

                {/* No permission */}
                {queryRef && !queryRef.hasPermission && (
                    <div className="alert alert-warning">
                        {t("noPermission")}
                    </div>
                )}
            </SearchFilterFeature>
        </LysQueryProvider>
    );
};

ListAdminRestricted.displayName = "ListAdminRestricted";

export default ListAdminRestricted;