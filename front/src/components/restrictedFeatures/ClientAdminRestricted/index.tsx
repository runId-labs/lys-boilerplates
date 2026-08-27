import React, {useEffect, useRef, useState} from "react";
import {graphql} from "react-relay";
import {useClientAdminRestrictedTranslations} from "./translations";
import {useClientId} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import ClientAdminFeature from "@/components/features/ClientAdminFeature";
import type {ClientAdminRestrictedQuery} from "./__generated__/ClientAdminRestrictedQuery.graphql";

/**
 * GraphQL query for fetching client data with subscription
 */
const ClientQuery = graphql`
    query ClientAdminRestrictedQuery($id: ID!) {
        client(id: $id) {
            id
            name
            createdAt
            updatedAt
            ownerId
            subscription {
                id
            }
            licensePlan {
                code
            }
        }
    }
`;

/**
 * ClientAdminRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client data access via LysQueryProvider
 * - Fetches client data using clientId from connected user
 * - Delegates UI rendering to ClientAdminFeature
 */
const ClientAdminRestricted: React.FC = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useClientAdminRestrictedTranslations();
    const {clientId} = useClientId();

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    const hasLoadedRef = useRef(false);

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ClientAdminRestrictedQuery> | null>(null);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Load query once when ref is ready and has permission
     */
    useEffect(() => {
        if (queryRef?.hasPermission && clientId && !hasLoadedRef.current) {
            hasLoadedRef.current = true;
            queryRef.load();
        }
    }, [clientId, queryRef?.hasPermission, queryRef]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    // No clientId - user is not associated with a client
    if (!clientId) {
        return (
            <div className="alert alert-info">
                {t("noClient")}
            </div>
        );
    }

    return (
        <LysQueryProvider
            query={ClientQuery}
            parameters={{id: clientId}}
            ref={setQueryRef}
        >
            {/* Client Admin Feature - displays client info */}
            {queryRef?.data?.client && (
                <ClientAdminFeature
                    clientData={queryRef.data.client}
                />
            )}

            {/* No permission */}
            {queryRef && !queryRef.hasPermission && (
                <div className="alert alert-warning">
                    {t("noPermission")}
                </div>
            )}
        </LysQueryProvider>
    );
};

ClientAdminRestricted.displayName = "ClientAdminRestricted";

export default ClientAdminRestricted;