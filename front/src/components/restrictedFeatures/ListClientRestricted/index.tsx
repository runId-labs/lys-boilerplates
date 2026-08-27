import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {ListClientRestrictedProps, OpenRequestRow} from "./types";
import InfoTooltipElement from "@/components/elements/InfoTooltipElement";
import {getClientListSearchFilterConfig} from "./config";
import {useListClientRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useUrlQueries} from "lys-front/providers";
import SearchFilterFeature from "@/components/features/SearchFilterFeature";
import ListFeature from "@/components/features/ListFeature";
import ManageClientDropdownFeature from "@/components/features/ManageClientDropdownFeature";
import {CurrentSubscription} from "@/components/restrictedFeatures/SubscribeClientManuallyRestricted/types";
import {formatPrice} from "@/tools/formatTools";
import {TableColumn, TableRowData} from "@/components/elements/TableElement/types";
import type {ListClientRestrictedQuery} from "./__generated__/ListClientRestrictedQuery.graphql";

/**
 * GraphQL query for fetching all clients
 */
const AllClientsQuery = graphql`
    query ListClientRestrictedQuery(
        $search: String
        $orderBy: ClientNodeOderByType
        $first: Int
        $last: Int
        $after: String
        $before: String
    ) {
        allClients(
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
                    id
                    name
                    openRequests {
                        id
                        typeId
                        statusId
                        createdAt
                    }
                    licensePlan {
                        code
                    }
                    subscription {
                        id
                        commitmentEndDate
                        billingMode {
                            code
                        }
                        planVersion {
                            version
                            enabled
                            plan {
                                code
                            }
                        }
                        planVersionPrice {
                            amount
                            period {
                                code
                            }
                            currency {
                                code
                                minorUnit
                            }
                            commitment {
                                code
                            }
                        }
                    }
                    createdAt
                    updatedAt
                    ownerId
                }
            }
        }
    }
`;

/**
 * ListClientRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client list
 * - GraphQL query via LysQueryProvider
 * - Search and sort functionality
 * - Pagination support
 */
const ListClientRestricted: React.FC<ListClientRestrictedProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useListClientRestrictedTranslations();
    const {appliedParams, update: updateUrlQueries} = useUrlQueries();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListClientRestrictedQuery> | null>(null);

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
    const clientListSearchFilterConfig = useMemo(
        () => getClientListSearchFilterConfig(t),
        [t]
    );

    /**
     * Transform URL parameters to GraphQL variables
     */
    const queryVariables = useMemo(() => {
        const orderByKey = orderByParam || clientListSearchFilterConfig.defaultSort;
        const orderDir = orderDirParam || clientListSearchFilterConfig.defaultSortDirection;
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
    }, [searchParam, orderByParam, orderDirParam, firstParam, lastParam, afterParam, beforeParam, clientListSearchFilterConfig]);

    // NOTE: lys currently splits ClientNode between the organization app (open_requests)
    // and the licensing app (subscription/licensePlan); the schema only exposes the
    // licensing view, so the open-requests column is disabled here. A project that
    // overrides ClientNode (merging both views) can restore the field
    // in the query and re-add the column.

    /**
     * The badge, and what it stands for on hover.
     *
     * A number alone tells an administrator that something is waiting without saying
     * what, which is one click away from being ignored. The tooltip carries the type
     * and the date, so the column is actionable where it stands.
     */
    const generateOpenRequestsColumn = useCallback((row: TableRowData) => {
        const requests = (row.openRequests || []) as OpenRequestRow[];

        if (!requests.length) {
            return <span className="text-muted">-</span>;
        }

        const content = requests
            .map(request => [
                common(request.typeId as never, {fallbackToKey: true}),
                common(request.statusId as never, {fallbackToKey: true}),
                new Date(request.createdAt).toLocaleDateString()
            ].join(" · "))
            .join("\n");

        return (
            <InfoTooltipElement content={content} title={t("openRequestsTooltipTitle")}>
                <span className="badge bg-warning text-dark">{requests.length}</span>
            </InfoTooltipElement>
        );
    }, [common, t]);

    /**
     * Table columns configuration
     */
    const columns = useMemo<TableColumn[]>(() => [
        {
            dataName: "name",
            label: t("nameColumn"),
            xs: 9,
            sm: 4,
            md: 4,
            lg: 3,
            xl: 3
        },
        {
            dataName: "licensePlanCode",
            label: t("licensePlanColumn"),
            xs: "d-none",
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2
        },
        {
            dataName: "openRequestCount",
            label: t("openRequestsColumn"),
            generator: (row) => generateOpenRequestsColumn(row),
            xs: "d-none",
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1
        },
        {
            dataName: "billingMode",
            label: t("billingModeColumn"),
            xs: "d-none",
            sm: 2,
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
        },
        {
            // Narrowed to make room for the requests badge: the grid must leave one
            // column for the row actions, or they wrap onto a second line.
            dataName: "updatedAt",
            label: t("updatedAtColumn"),
            xs: "d-none",
            sm: 2,
            md: 2,
            lg: 1,
            xl: 1
        }
    ], [t]);

    /**
     * Transform query data to table rows
     */
    const tableData = useMemo<TableRowData[]>(() => {
        if (!queryRef?.data?.allClients?.edges) return [];

        return queryRef.data.allClients.edges.map(edge => {
            const client = edge.node;

            const createdDate = client.createdAt
                ? new Date(client.createdAt).toLocaleDateString()
                : "-";

            const updatedDate = client.updatedAt
                ? new Date(client.updatedAt).toLocaleDateString()
                : "-";

            const licensePlanCode = client.licensePlan?.code
                ? common(client.licensePlan.code as never, { fallbackToKey: true })
                : "-";

            return {
                id: client.id,
                name: client.name,
                licensePlanCode,
                createdAt: createdDate,
                updatedAt: updatedDate,
                ownerId: client.ownerId,
                subscriptionId: client.subscription?.id || null,
                billingMode: client.subscription?.billingMode
                    ? common(client.subscription.billingMode.code as never, {fallbackToKey: true})
                    : "-",
                billingModeCode: client.subscription?.billingMode?.code ?? null,
                // Carried to the row menu, so the assignment dialog can state
                // what the client is on before offering to change it
                currentSubscription: {
                    planCode: client.subscription?.planVersion?.plan?.code ?? null,
                    version: client.subscription?.planVersion?.version ?? null,
                    versionEnabled: client.subscription?.planVersion?.enabled ?? true,
                    price: client.subscription?.planVersionPrice
                        ? [
                            formatPrice(
                                client.subscription.planVersionPrice.amount,
                                client.subscription.planVersionPrice.currency.code,
                                client.subscription.planVersionPrice.currency.minorUnit
                            ),
                            common(client.subscription.planVersionPrice.period.code as never, {fallbackToKey: true}),
                            common(client.subscription.planVersionPrice.commitment.code as never, {fallbackToKey: true})
                        ].join(" · ")
                        : null,
                    commitmentEndDate: client.subscription?.commitmentEndDate ?? null
                }
            };
        });
    }, [queryRef?.data, common]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Load query when ref is ready and has permission
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
     * Generate dropdown menu actions for each row
     */
    const generateRowActions = (row: TableRowData) => (
        <ManageClientDropdownFeature
            clientId={row.id as string}
            ownerId={row.ownerId as string}
            subscriptionId={row.subscriptionId as string | null}
            currentSubscription={row.currentSubscription as CurrentSubscription}
            billingModeCode={row.billingModeCode as string | null}
            allowPlanChange={false}
            onUpdated={() => queryRef?.load()}
        />
    );

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
            query={AllClientsQuery}
            parameters={queryVariables}
            ref={setQueryRef}
        >
            <SearchFilterFeature
                {...clientListSearchFilterConfig}
                onParametersChange={handleParametersChange}
            >
                {/* Client List */}
                {queryRef?.data && (
                    <ListFeature
                        columns={columns}
                        data={tableData}
                        actionGenerator={generateRowActions}
                        actionColumnLabel={t("actionsColumn")}
                        pageInfo={queryRef.data.allClients?.pageInfo}
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

ListClientRestricted.displayName = "ListClientRestricted";

export default ListClientRestricted;