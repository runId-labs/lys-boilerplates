import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {GetClientRestrictedProps, GetClientRestrictedRefInterface} from "./types";
import {useGetClientRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {useWebserviceAccess} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import UpdateClientRestricted, {UpdateClientMutation} from "@/components/restrictedFeatures/UpdateClientRestricted";
import TabElement from "@/components/elements/TabElement";
import {TabItem} from "@/components/elements/TabElement/types";
import ButtonElement from "@/components/elements/ButtonElement";
import type {GetClientRestrictedQuery} from "./__generated__/GetClientRestrictedQuery.graphql";

/**
 * GraphQL query for fetching client data
 */
export const ClientQuery = graphql`
    query GetClientRestrictedQuery($id: ID!) {
        client(id: $id) {
            id
            name
            createdAt
            updatedAt
        }
    }
`;

/**
 * Tab keys enum for type safety
 */
enum ClientManagementTab {
    INFO = "info"
}

/**
 * Client management tabs component for offcanvas body
 */
interface ClientManagementTabsProps {
    clientData: GetClientRestrictedQuery["response"]["client"] | null;
    t: (key: any) => string;
    onCompleted?: () => void;
}

const ClientManagementTabs: React.FC<ClientManagementTabsProps> = ({clientData, t, onCompleted}) => {
    const {checkOperationsPermission} = useWebserviceAccess();

    /**
     * Tab items configuration with permission-based visibility
     */
    const tabItems = useMemo<Record<string, TabItem>>(() => ({
        [ClientManagementTab.INFO]: {
            label: t("tabClientInfo"),
            icon: "bi-building",
            visible: checkOperationsPermission(UpdateClientMutation),
            render: () => (
                <UpdateClientRestricted
                    clientId={clientData?.id || ""}
                    currentName={clientData?.name || ""}
                    onCompleted={onCompleted}
                />
            )
        }
    }), [clientData, t, onCompleted, checkOperationsPermission]);

    return (
        <TabElement
            uniqueKey="client-management-tabs"
            items={tabItems}
            defaultActiveKey={ClientManagementTab.INFO}
        />
    );
};

/**
 * GetClientRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client data access via LysQueryProvider
 * - Button to open offcanvas with client management tab
 * - Uses UpdateClientRestricted for editing client information
 */
const GetClientRestricted = forwardRef<GetClientRestrictedRefInterface, GetClientRestrictedProps>(
    ({clientId, buttonText, buttonVariant = "outline-secondary", buttonSize = "sm", display = true}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useGetClientRestrictedTranslations();
        const {open, update} = useLysDialog();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<GetClientRestrictedQuery> | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Dialog unique key used for open and update operations
         */
        const dialogKey = useMemo(() => `client-management-${clientId}`, [clientId]);

        /**
         * Handle completed update - reload query data
         */
        const handleCompleted = useCallback(() => {
            queryRef?.load();
        }, [queryRef]);

        /**
         * Dialog bodyProps - memoized to avoid unnecessary re-renders
         */
        const bodyProps = useMemo(() => ({
            clientData: queryRef?.data?.client ?? null,
            t,
            onCompleted: handleCompleted
        }), [queryRef?.data?.client, t, handleCompleted]);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle button click - open offcanvas with loading, then load data
         */
        const handleOpenOffcanvas = useCallback(() => {
            // Open offcanvas immediately with loading state
            open({
                uniqueKey: dialogKey,
                title: t("offcanvasTitle"),
                body: ClientManagementTabs,
                bodyProps,
                placement: "end",
                size: "lg",
                loading: true
            });

            // Load data
            if (!queryRef?.isLoading) {
                queryRef?.load();
            }
        }, [dialogKey, t, open, queryRef, bodyProps]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Update dialog when query data changes (after query load)
         */
        useEffect(() => {
            if (queryRef?.data?.client) {
                update(dialogKey, {bodyProps, loading: false});
            }
        }, [dialogKey, queryRef?.data?.client, update, bodyProps]);

        /**
         * Expose hasPermission and open via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!queryRef?.hasPermission,
            open: handleOpenOffcanvas
        }), [queryRef?.hasPermission, handleOpenOffcanvas]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysQueryProvider
                query={ClientQuery}
                parameters={{id: clientId}}
                ref={setQueryRef}
            >
                {display && (
                    <ButtonElement
                        variant={buttonVariant}
                        size={buttonSize}
                        onClick={handleOpenOffcanvas}
                    >
                        {buttonText || <i className="bi bi-eye" />}
                    </ButtonElement>
                )}
            </LysQueryProvider>
        );
    }
);

GetClientRestricted.displayName = "GetClientRestricted";

export default GetClientRestricted;