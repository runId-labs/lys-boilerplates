import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {ListPlanVersionRestrictedProps} from "./types";
import {getPlanVersionListSearchFilterConfig} from "./config";
import {useListPlanVersionRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useUrlQueries} from "lys-front/providers";
import SearchFilterFeature from "@/components/features/SearchFilterFeature";
import ShowActionsFeature from "@/components/features/ShowActionsFeature";
import ListFeature from "@/components/features/ListFeature";
import ManagePlanVersionDropdownFeature from "@/components/features/ManagePlanVersionDropdownFeature";
import {useCreatePlanVersionRestrictedAction} from "@/components/restrictedFeatures/CreatePlanVersionRestricted/hooks";
import {TableColumn, TableRowData} from "@/components/elements/TableElement/types";
import {formatPrice} from "@/tools/formatTools";
import type {ListPlanVersionRestrictedQuery} from "./__generated__/ListPlanVersionRestrictedQuery.graphql";

/**
 * GraphQL query for fetching all plan versions
 *
 * Disabled versions are returned as well: they are what an administrator needs
 * to see to put a previous version back.
 */
const AllPlanVersionsQuery = graphql`
    query ListPlanVersionRestrictedQuery(
        $planId: String
        $enabled: Boolean
        $orderBy: LicensePlanVersionNodeOderByType
        $first: Int
        $last: Int
        $after: String
        $before: String
    ) {
        allLicensePlanVersions(
            planId: $planId
            enabled: $enabled
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
                    version
                    enabled
                    isFree
                    plan {
                        code
                    }
                    prices {
                        id
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
                    rules {
                        id
                        limitValue
                        rule {
                            code
                        }
                    }
                }
            }
        }
    }
`;

/**
 * ListPlanVersionRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected plan version list
 * - GraphQL query via LysQueryProvider
 * - Sort and pagination support
 */
const ListPlanVersionRestricted: React.FC<ListPlanVersionRestrictedProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useListPlanVersionRestrictedTranslations();
    const {appliedParams, update: updateUrlQueries} = useUrlQueries();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListPlanVersionRestrictedQuery> | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Extract individual URL parameter values
     */
    const planIdParam = appliedParams.get("planId");
    const enabledParam = appliedParams.get("enabled");
    const orderByParam = appliedParams.get("orderBy");
    const orderDirParam = appliedParams.get("orderDir");
    const firstParam = appliedParams.get("first");
    const lastParam = appliedParams.get("last");
    const afterParam = appliedParams.get("after");
    const beforeParam = appliedParams.get("before");

    /**
     * Publish a version of the plan currently used as a list filter, so the
     * form opens on the plan the user is already looking at
     */
    const createPlanVersionAction = useCreatePlanVersionRestrictedAction({
        onCompleted: () => queryRef?.load(),
        initParameters: planIdParam ? {planId: planIdParam} : {}
    });

    /**
     * Get translated search filter configuration
     */
    const planVersionListSearchFilterConfig = useMemo(
        () => getPlanVersionListSearchFilterConfig(t),
        [t]
    );

    /**
     * Transform URL parameters to GraphQL variables
     */
    const queryVariables = useMemo(() => {
        const orderByKey = orderByParam || planVersionListSearchFilterConfig.defaultSort;
        const orderDir = orderDirParam || planVersionListSearchFilterConfig.defaultSortDirection;
        const first = firstParam ? parseInt(firstParam, 10) : (lastParam ? null : 50);
        const last = lastParam ? parseInt(lastParam, 10) : null;

        return {
            planId: planIdParam || null,
            enabled: enabledParam !== null ? enabledParam === "true" : null,
            orderBy: orderByKey ? {[orderByKey]: orderDir === "ASC"} : null,
            first,
            last,
            after: afterParam || null,
            before: beforeParam || null
        };
    }, [planIdParam, enabledParam, orderByParam, orderDirParam, firstParam, lastParam, afterParam, beforeParam, planVersionListSearchFilterConfig]);

    /**
     * Table columns configuration
     */
    const columns = useMemo<TableColumn[]>(() => [
        {
            dataName: "planCode",
            label: t("planColumn"),
            xs: 5,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 3
        },
        {
            dataName: "version",
            label: t("versionColumn"),
            xs: 2,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1
        },
        {
            dataName: "prices",
            label: t("pricesColumn"),
            // One price per line: a version carries one price per commitment,
            // which is unreadable on a single line
            generator: (row) => (
                <>
                    {(row.prices as string[]).map((price, index) => (
                        <div key={index}>{price}</div>
                    ))}
                </>
            ),
            xs: "d-none",
            sm: 4,
            md: 4,
            lg: 3,
            xl: 3
        },
        {
            dataName: "rules",
            label: t("rulesColumn"),
            generator: (row) => (
                <>
                    {(row.rules as string[]).map((rule, index) => (
                        <div key={index}>{rule}</div>
                    ))}
                </>
            ),
            xs: "d-none",
            sm: "d-none",
            md: "d-none",
            lg: 2,
            xl: 2
        },
        {
            dataName: "status",
            label: t("statusColumn"),
            xs: 3,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2
        }
    ], [t]);

    /**
     * Transform query data to table rows
     */
    const tableData = useMemo<TableRowData[]>(() => {
        if (!queryRef?.data?.allLicensePlanVersions?.edges) return [];

        return queryRef.data.allLicensePlanVersions.edges.map(edge => {
            const planVersion = edge.node;

            const prices = planVersion.prices.map(price => [
                formatPrice(price.amount, price.currency.code, price.currency.minorUnit),
                common(price.period.code as never, {fallbackToKey: true}),
                common(price.commitment.code as never, {fallbackToKey: true})
            ].join(" · "));

            return {
                id: planVersion.id,
                isEnabled: planVersion.enabled,
                // Carried to the row menu, so the quota dialog opens on the
                // limits already in place rather than on empty fields
                versionRules: planVersion.rules.map(rule => ({
                    ruleCode: rule.rule.code,
                    limitValue: rule.limitValue ?? null
                })),
                planCode: common(planVersion.plan.code as never, {fallbackToKey: true}),
                version: `v${planVersion.version}`,
                prices: planVersion.isFree ? [t("freeVersion")] : prices,
                rules: planVersion.rules.map(rule => {
                    const label = common(rule.rule.code as never, {fallbackToKey: true});
                    const limit = rule.limitValue === null ? common("unlimited") : String(rule.limitValue);
                    return `${label} : ${limit}`;
                }),
                status: planVersion.enabled ? t("statusEnabled") : t("statusDisabled")
            };
        });
    }, [queryRef?.data, t, common]);

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
        <ManagePlanVersionDropdownFeature
            planVersionId={row.id as string}
            enabled={row.isEnabled as boolean}
            rules={row.versionRules as {ruleCode: string; limitValue: number | null}[]}
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
            query={AllPlanVersionsQuery}
            parameters={queryVariables}
            ref={setQueryRef}
        >
            <SearchFilterFeature
                {...planVersionListSearchFilterConfig}
                onParametersChange={handleParametersChange}
                actions={
                    <ShowActionsFeature
                        primaryAction={createPlanVersionAction}
                    />
                }
            >
                {/* Plan version list */}
                {queryRef?.data && (
                    <ListFeature
                        columns={columns}
                        data={tableData}
                        actionGenerator={generateRowActions}
                        actionColumnLabel={t("actionsColumn")}
                        pageInfo={queryRef.data.allLicensePlanVersions?.pageInfo}
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

ListPlanVersionRestricted.displayName = "ListPlanVersionRestricted";

export default ListPlanVersionRestricted;
