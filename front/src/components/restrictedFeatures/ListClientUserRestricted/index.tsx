import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {graphql} from "react-relay";
import {ListClientUserRestrictedProps} from "./types";
import {getClientUserListSearchFilterConfig} from "./config";
import {useListClientUserRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useUrlQueries, useClientId} from "lys-front/providers";
import SearchFilterFeature from "@/components/features/SearchFilterFeature";
import ListClientUserFeature from "@/components/features/ListClientUserFeature";
import ShowActionsFeature from "@/components/features/ShowActionsFeature";
import GetClientUserRestricted from "@/components/restrictedFeatures/GetClientUserRestricted";
import {GetClientUserRestrictedRefInterface} from "@/components/restrictedFeatures/GetClientUserRestricted/types";
import AddClientUserToSubscriptionRestricted from "@/components/restrictedFeatures/AddClientUserToSubscriptionRestricted";
import {AddClientUserToSubscriptionRestrictedRefInterface} from "@/components/restrictedFeatures/AddClientUserToSubscriptionRestricted/types";
import RemoveClientUserFromSubscriptionRestricted from "@/components/restrictedFeatures/RemoveClientUserFromSubscriptionRestricted";
import {RemoveClientUserFromSubscriptionRestrictedRefInterface} from "@/components/restrictedFeatures/RemoveClientUserFromSubscriptionRestricted/types";
import {useCreateClientUserRestrictedAction} from "@/components/restrictedFeatures/CreateClientUserRestricted/hooks";
import type {ListClientUserRestrictedQuery} from "./__generated__/ListClientUserRestrictedQuery.graphql";
import {TableRowData} from "@/components/elements/TableElement/types";
import DropDownMenuElement from "@/components/elements/DropDownMenuElement";
import {DropDownMenu} from "@/components/elements/DropDownMenuElement/types";

/**
 * Row actions component for client user list
 * Separated to properly use hooks (useRef)
 */
const ClientUserRowActions: React.FC<{
    clientUserId: string;
    isLicensed: boolean;
    viewActionLabel: string;
    addLicenseLabel: string;
    removeLicenseLabel: string;
    onRefresh?: () => void;
}> = ({
    clientUserId,
    isLicensed,
    viewActionLabel,
    addLicenseLabel,
    removeLicenseLabel,
    onRefresh
}) => {
    const getClientUserRef = useRef<GetClientUserRestrictedRefInterface>(null);
    const addToSubscriptionRef = useRef<AddClientUserToSubscriptionRestrictedRefInterface>(null);
    const removeFromSubscriptionRef = useRef<RemoveClientUserFromSubscriptionRestrictedRefInterface>(null);

    const menus = useMemo(() => {
        const menuGroup: DropDownMenu = {
            view: {
                icon: <i className="bi bi-eye" />,
                label: viewActionLabel,
                onClick: () => getClientUserRef.current?.open()
            }
        };

        // Only show "Add license" if user is not already licensed
        if (!isLicensed) {
            menuGroup.addLicense = {
                icon: <i className="bi bi-plus-circle" />,
                label: addLicenseLabel,
                onClick: () => addToSubscriptionRef.current?.open()
            };
        }

        // Only show "Remove license" if user is licensed
        if (isLicensed) {
            menuGroup.removeLicense = {
                icon: <i className="bi bi-dash-circle" />,
                label: removeLicenseLabel,
                onClick: () => removeFromSubscriptionRef.current?.open()
            };
        }

        return [menuGroup];
    }, [viewActionLabel, addLicenseLabel, removeLicenseLabel, isLicensed]);

    return (
        <>
            <GetClientUserRestricted
                ref={getClientUserRef}
                clientUserId={clientUserId}
                display={false}
            />
            {!isLicensed && (
                <AddClientUserToSubscriptionRestricted
                    ref={addToSubscriptionRef}
                    clientUserId={clientUserId}
                    display={false}
                    onCompleted={onRefresh}
                />
            )}
            {isLicensed && (
                <RemoveClientUserFromSubscriptionRestricted
                    ref={removeFromSubscriptionRef}
                    clientUserId={clientUserId}
                    display={false}
                    onCompleted={onRefresh}
                />
            )}
            <DropDownMenuElement menus={menus} size="sm" />
        </>
    );
};

/**
 * GraphQL query for fetching all client users
 */
const AllClientUsersQuery = graphql`
    query ListClientUserRestrictedQuery(
        $search: String
        $clientId: ID
        $roleCode: String
        $isLicensed: Boolean
        $orderBy: UserNodeOderByType
        $first: Int
        $last: Int
        $after: String
        $before: String
    ) {
        allClientUsers(
            search: $search
            clientId: $clientId
            roleCode: $roleCode
            isLicensed: $isLicensed
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
                    ...ListUserFeatureFragment_clientUser
                }
            }
        }
    }
`;

/**
 * ListClientUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client user list
 * - GraphQL query via LysQueryProvider
 * - Search, filter, and sort functionality
 * - Pagination support
 * - Client user management via GetClientUserRestricted
 *
 * This is a restricted feature component (Layer 3) that:
 * - Manages permissions and query loading
 * - Delegates UI rendering to ListClientUserFeature (container)
 * - Provides search/filter capabilities
 */
const ListClientUserRestricted: React.FC<ListClientUserRestrictedProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useListClientUserRestrictedTranslations();
    const {appliedParams, update: updateUrlQueries} = useUrlQueries();
    const {clientId} = useClientId();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListClientUserRestrictedQuery> | null>(null);

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
    const isLicensedParam = appliedParams.get("isLicensed");

    /**
     * Create client user action hook
     * User can select client from the form if not filtering by clientId
     */
    const createClientUserAction = useCreateClientUserRestrictedAction({
        onCompleted: () => {
            queryRef?.load();
        }
    });

    /**
     * Get translated search filter configuration
     */
    const clientUserListSearchFilterConfig = useMemo(
        () => getClientUserListSearchFilterConfig(t),
        [t]
    );

    /**
     * Transform URL parameters to GraphQL variables
     */
    const queryVariables = useMemo(() => {
        const orderByKey = orderByParam || clientUserListSearchFilterConfig.defaultSort;
        const orderDir = orderDirParam || clientUserListSearchFilterConfig.defaultSortDirection;
        const first = firstParam ? parseInt(firstParam, 10) : (lastParam ? null : 50);
        const last = lastParam ? parseInt(lastParam, 10) : null;

        return {
            search: searchParam || null,
            clientId: clientId || null,
            roleCode: roleCodeParam || null,
            isLicensed: isLicensedParam ? isLicensedParam === "true" : null,
            orderBy: orderByKey ? {[orderByKey]: orderDir === "ASC"} : null,
            first,
            last,
            after: afterParam || null,
            before: beforeParam || null
        };
    }, [searchParam, roleCodeParam, isLicensedParam, orderByParam, orderDirParam, firstParam, lastParam, afterParam, beforeParam, clientId, clientUserListSearchFilterConfig]);

    /**
     * Extract client users fragment ref from query data
     */
    const clientUsersFragmentRef = useMemo(() => {
        if (!queryRef?.data?.allClientUsers?.edges) return [];
        return queryRef.data.allClientUsers.edges.map(edge => edge.node);
    }, [queryRef?.data]);

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
     * Refresh list after mutation
     */
    const handleRefresh = useCallback(() => {
        queryRef?.load();
    }, [queryRef]);

    /**
     * Generate action dropdown for each row
     */
    const generateRowActions = useCallback((row: TableRowData) => (
        <ClientUserRowActions
            clientUserId={row.id as string}
            isLicensed={row.isLicensed as boolean}
            viewActionLabel={t("viewAction")}
            addLicenseLabel={t("addLicenseAction")}
            removeLicenseLabel={t("removeLicenseAction")}
            onRefresh={handleRefresh}
        />
    ), [t, handleRefresh]);

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
            query={AllClientUsersQuery}
            parameters={queryVariables}
            ref={setQueryRef}
        >
            <SearchFilterFeature
                {...clientUserListSearchFilterConfig}
                onParametersChange={handleParametersChange}
                actions={
                    <ShowActionsFeature
                        primaryAction={createClientUserAction}
                    />
                }
            >
                {/* Client User List - delegated to ListClientUserFeature */}
                {queryRef?.data && (
                    <ListClientUserFeature
                        clientUsersFragmentRef={clientUsersFragmentRef}
                        pageInfo={queryRef.data.allClientUsers?.pageInfo}
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

ListClientUserRestricted.displayName = "ListClientUserRestricted";

export default ListClientUserRestricted;