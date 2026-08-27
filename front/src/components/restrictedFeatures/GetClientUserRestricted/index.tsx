import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {GetClientUserRestrictedProps, GetClientUserRestrictedRefInterface} from "./types";
import {useGetClientUserRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import ClientUserManagementTabsFeature from "@/components/features/ClientUserManagementTabsFeature";
import ButtonElement from "@/components/elements/ButtonElement";
import type {GetClientUserRestrictedQuery} from "./__generated__/GetClientUserRestrictedQuery.graphql";

/**
 * GetClientUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client user data access via LysQueryProvider
 * - Button to open offcanvas with client user management tabs
 * - Personal information, email, and roles management
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch client user data
 * - Manages offcanvas dialog via LysDialogProvider
 * - Provides tabbed interface for client user management
 */
const GetClientUserRestricted = forwardRef<GetClientUserRestrictedRefInterface, GetClientUserRestrictedProps>(
    ({clientUserId, buttonText, buttonVariant = "primary", buttonSize = "sm", display = true}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useGetClientUserRestrictedTranslations();
        const {open, update} = useLysDialog();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<GetClientUserRestrictedQuery> | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Dialog unique key used for open and update operations
         */
        const dialogKey = useMemo(() => `client-user-management-${clientUserId}`, [clientUserId]);

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
                body: ClientUserManagementTabsFeature,
                bodyProps: {
                    clientUserFragmentRef: null
                },
                placement: "end",
                size: "lg",
                loading: true
            });

            // Load data
            if (!queryRef?.isLoading) {
                queryRef?.load();
            }
        }, [dialogKey, t, open, queryRef]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Update dialog when query data changes (after query load)
         */
        useEffect(() => {
            // Only update if dialog is open and we have new data
            if (queryRef?.data?.clientUser) {
                update(dialogKey, {
                    bodyProps: {
                        clientUserFragmentRef: queryRef.data.clientUser
                    },
                    loading: false
                });
            }
        }, [dialogKey, queryRef?.data?.clientUser, update]);

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
                query={graphql`
                    query GetClientUserRestrictedQuery($id: ID!) {
                        clientUser(id: $id) {
                            id
                            ...UpdateClientUserPrivateDataRestrictedFragment_clientUser
                            ...UpdateClientUserEmailRestrictedFragment_clientUser
                            ...UpdateClientUserRolesRestrictedFragment_clientUser
                        }
                    }
                `}
                parameters={{id: clientUserId}}
                ref={setQueryRef}
            >
                {display && (
                    <ButtonElement
                        variant={buttonVariant}
                        size={buttonSize}
                        onClick={handleOpenOffcanvas}
                    >
                        {buttonText || t("buttonText")}
                    </ButtonElement>
                )}
            </LysQueryProvider>
        );
    }
);

GetClientUserRestricted.displayName = "GetClientUserRestricted";

export default GetClientUserRestricted;
