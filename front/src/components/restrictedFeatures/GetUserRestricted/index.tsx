import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {GetUserRestrictedProps, GetUserRestrictedRefInterface} from "./types";
import {useGetUserRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import UserManagementTabsFeature from "@/components/features/UserManagementTabsFeature";
import ButtonElement from "@/components/elements/ButtonElement";
import type {GetUserRestrictedQuery} from "./__generated__/GetUserRestrictedQuery.graphql";

/**
 * GraphQL query for fetching user data
 */
export const UserQuery = graphql`
    query GetUserRestrictedQuery($id: ID!) {
        user(id: $id) {
            id
            ...UpdateUserPrivateDataRestrictedFragment_user
            ...UpdateUserEmailRestrictedFragment_user
        }
    }
`;

/**
 * GetUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected user data access via LysQueryProvider
 * - Button to open offcanvas with user management tabs (without roles)
 * - Personal information and email management
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch user data
 * - Manages offcanvas dialog via LysDialogProvider
 * - Provides tabbed interface for user management
 */
const GetUserRestricted = forwardRef<GetUserRestrictedRefInterface, GetUserRestrictedProps>(
    ({userId, accessParameters, buttonText, buttonVariant = "primary", buttonSize = "sm", display = true}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useGetUserRestrictedTranslations();
        const {open, update} = useLysDialog();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<GetUserRestrictedQuery> | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Dialog unique key used for open and update operations
         */
        const dialogKey = useMemo(() => `user-management-${userId}`, [userId]);

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
                body: UserManagementTabsFeature,
                bodyProps: {
                    userFragmentRef: null
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
            if (queryRef?.data?.user) {
                update(dialogKey, {
                    bodyProps: {
                        userFragmentRef: queryRef.data.user
                    },
                    loading: false
                });
            }
        }, [dialogKey, queryRef?.data?.user, update]);

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
                query={UserQuery}
                parameters={{id: userId}}
                accessParameters={accessParameters}
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

GetUserRestricted.displayName = "GetUserRestricted";

export default GetUserRestricted;