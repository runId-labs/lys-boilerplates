import React, {useEffect, useMemo, useState} from "react";
import {graphql, useFragment} from "react-relay";
import {ListSuperUserRestrictedProps} from "./types";
import {getSuperUserListSearchFilterConfig} from "./config";
import {useListSuperUserRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useUrlQueries} from "lys-front/providers";
import SearchFilterFeature from "@/components/features/SearchFilterFeature";
import ListFeature from "@/components/features/ListFeature";
import ShowActionsFeature from "@/components/features/ShowActionsFeature";
import BadgeElement from "@/components/elements/BadgeElement";
import GetSuperUserRestricted from "@/components/restrictedFeatures/GetSuperUserRestricted";
import {useCreateSuperUserRestrictedAction} from "@/components/restrictedFeatures/CreateSuperUserRestricted/hooks";
import {TableColumn, TableRowData} from "@/components/elements/TableElement/types";
import type {ListSuperUserRestrictedQuery} from "./__generated__/ListSuperUserRestrictedQuery.graphql";
import type {ListSuperUserRestrictedFragment_user$key} from "./__generated__/ListSuperUserRestrictedFragment_user.graphql";

/**
 * User status configuration
 */
type UserStatusCode = "ENABLED" | "DISABLED" | "REVOKED" | "DELETED";

interface UserStatusConfig {
    variant: "success" | "danger" | "warning" | "secondary";
    translationKey: string;
}

const userStatusConfig: Record<UserStatusCode | "unknown", UserStatusConfig> = {
    ENABLED: {variant: "success", translationKey: "statusActive"},
    DISABLED: {variant: "secondary", translationKey: "statusInactive"},
    REVOKED: {variant: "warning", translationKey: "statusRevoked"},
    DELETED: {variant: "danger", translationKey: "statusDeleted"},
    unknown: {variant: "secondary", translationKey: "statusUnknown"}
};

/**
 * GraphQL fragment for super user data
 */
const SuperUserFragment = graphql`
    fragment ListSuperUserRestrictedFragment_user on UserNode @relay(plural: true) {
        id
        createdAt
        emailAddress {
            address
        }
        privateData {
            firstName
            lastName
        }
        status {
            code
        }
    }
`;

/**
 * GraphQL query for all super users list with pagination support
 */
const AllSuperUsersQuery = graphql`
    query ListSuperUserRestrictedQuery(
        $search: String
        $orderBy: UserNodeOderByType
        $first: Int
        $last: Int
        $after: String
        $before: String
    ) {
        allSuperUsers(
            search: $search
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
                    ...ListSuperUserRestrictedFragment_user
                }
            }
        }
    }
`;

/**
 * ListSuperUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected super user list access
 * - GraphQL query via LysQueryProvider for allSuperUsers
 * - Search and filter functionality via SearchFilterFeature
 * - URL-synchronized filters and sorting
 * - No roles column (super users don't have roles)
 */
const ListSuperUserRestricted: React.FC<ListSuperUserRestrictedProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useListSuperUserRestrictedTranslations();
    const {appliedParams, update: updateUrlQueries} = useUrlQueries();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListSuperUserRestrictedQuery> | null>(null);

    /**
     * Create super user action hook
     * Uses a callback that will access the current queryRef via closure
     */
    const createSuperUserAction = useCreateSuperUserRestrictedAction({
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
    const orderByParam = appliedParams.get("orderBy");
    const orderDirParam = appliedParams.get("orderDir");
    const firstParam = appliedParams.get("first");
    const lastParam = appliedParams.get("last");
    const afterParam = appliedParams.get("after");
    const beforeParam = appliedParams.get("before");

    /**
     * Get translated search filter configuration
     */
    const superUserListSearchFilterConfig = useMemo(() => getSuperUserListSearchFilterConfig(t), [t]);

    /**
     * Transform URL parameters to GraphQL variables
     */
    const queryVariables = useMemo(() => {
        const orderByKey = orderByParam || superUserListSearchFilterConfig.defaultSort;
        const orderDir = orderDirParam || superUserListSearchFilterConfig.defaultSortDirection;
        const first = firstParam ? parseInt(firstParam, 10) : (lastParam ? null : 50);
        const last = lastParam ? parseInt(lastParam, 10) : null;

        return {
            search: searchParam || null,
            orderBy: orderByKey ? {[orderByKey]: orderDir === "ASC"} : null,
            first,
            last,
            after: afterParam || null,
            before: beforeParam || null
        };
    }, [searchParam, orderByParam, orderDirParam, firstParam, lastParam, afterParam, beforeParam, superUserListSearchFilterConfig]);

    /**
     * Extract super users fragment ref from query data
     */
    const superUsersFragmentRef = useMemo(() => {
        if (!queryRef?.data?.allSuperUsers?.edges) return [];
        return queryRef.data.allSuperUsers.edges.map(edge => edge.node);
    }, [queryRef?.data]);

    /*******************************************************************************************************************
     *                                              FRAGMENT DATA
     ******************************************************************************************************************/

    // Unmask super user fragment
    const superUsers = useFragment(SuperUserFragment, superUsersFragmentRef as ListSuperUserRestrictedFragment_user$key);

    /**
     * Super users table columns (without roles)
     */
    const columns = useMemo<TableColumn[]>(() => [
        {
            dataName: "emailAddress",
            label: t("emailColumn"),
            xs: "d-none",
            sm: 5,
            md: 4,
            lg: 4,
            xl: 4
        },
        {
            dataName: "fullName",
            label: t("nameColumn"),
            xs: 9,
            sm: 5,
            md: 4,
            lg: 3,
            xl: 3
        },
        {
            dataName: "status",
            label: t("statusColumn"),
            xs: "d-none",
            sm: "d-none",
            md: 2,
            lg: 2,
            xl: 2
        },
        {
            dataName: "createdAt",
            label: t("createdAtColumn"),
            xs: "d-none",
            sm: "d-none",
            md: "d-none",
            lg: 2,
            xl: 2
        }
    ], [t]);

    /**
     * Transform super user data to table row data
     */
    const tableData = useMemo<TableRowData[]>(() => {
        if (!superUsers || superUsers.length === 0) return [];

        return superUsers.map((user: typeof superUsers[number]) => {
            // Format date
            const createdDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-";

            // Status badge
            const statusCode = (user.status?.code || "unknown") as UserStatusCode | "unknown";
            const statusInfo = userStatusConfig[statusCode] || userStatusConfig.unknown;

            // Full name
            const firstName = user.privateData?.firstName || "";
            const lastName = user.privateData?.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || "-";

            return {
                id: user.id,
                emailAddress: user.emailAddress?.address || "-",
                fullName: fullName,
                status: (
                    <BadgeElement bg={statusInfo.variant}>
                        {t(statusInfo.translationKey as any)}
                    </BadgeElement>
                ),
                createdAt: createdDate
            };
        });
    }, [superUsers, t]);

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
     */
    const handleParametersChange = () => {
        // Query reload is handled by useEffect when queryVariables change
    };

    /**
     * Generate action button for each row
     */
    const generateRowActions = (row: TableRowData) => {
        return (
            <GetSuperUserRestricted
                userId={row.id as string}
                buttonVariant="outline-secondary"
                buttonSize="sm"
                buttonText={<i className="bi bi-eye" />}
            />
        );
    };

    /**
     * Handle pagination changes
     */
    const handlePaginationChange = (event: {first?: number | null; last?: number | null; after?: string | null; before?: string | null}) => {
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
            query={AllSuperUsersQuery}
            parameters={queryVariables}
            ref={setQueryRef}
        >
            <SearchFilterFeature
                {...superUserListSearchFilterConfig}
                onParametersChange={handleParametersChange}
                actions={
                    <ShowActionsFeature
                        primaryAction={createSuperUserAction}
                    />
                }
            >
                {/* Super User List */}
                {queryRef?.data && (
                    <ListFeature
                        columns={columns}
                        data={tableData}
                        actionGenerator={generateRowActions}
                        actionColumnLabel={t("actionsColumn")}
                        pageInfo={queryRef.data.allSuperUsers?.pageInfo}
                        itemsPerPage={queryVariables.first ?? queryVariables.last ?? 50}
                        emptyMessage={t("noData")}
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

ListSuperUserRestricted.displayName = "ListSuperUserRestricted";

export default ListSuperUserRestricted;