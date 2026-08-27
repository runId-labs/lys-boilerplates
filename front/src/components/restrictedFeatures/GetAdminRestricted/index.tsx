import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {GetAdminRestrictedProps, GetAdminRestrictedRefInterface} from "./types";
import {useGetAdminRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import AdminManagementTabsFeature from "@/components/features/AdminManagementTabsFeature";
import ButtonElement from "@/components/elements/ButtonElement";
import type {GetAdminRestrictedQuery} from "./__generated__/GetAdminRestrictedQuery.graphql";

/**
 * GetAdminRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected user data access via LysQueryProvider
 * - Button to open offcanvas with user management tabs
 * - Personal information and email management
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch user data
 * - Manages offcanvas dialog via LysDialogProvider
 * - Provides tabbed interface for user management
 */
const GetAdminRestricted = forwardRef<GetAdminRestrictedRefInterface, GetAdminRestrictedProps>(
    ({userId, buttonText, buttonVariant = "primary", buttonSize = "sm"}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useGetAdminRestrictedTranslations();
        const {open, update} = useLysDialog();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<GetAdminRestrictedQuery> | null>(null);

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
                body: AdminManagementTabsFeature,
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
         * Expose hasPermission via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!queryRef?.hasPermission
        }), [queryRef?.hasPermission]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysQueryProvider
                query={graphql`
                    query GetAdminRestrictedQuery($id: ID!) {
                        user(id: $id) {
                            id
                            ...UpdateUserPrivateDataRestrictedFragment_user
                            ...UpdateUserEmailRestrictedFragment_user
                            ...UpdateUserRolesRestrictedFragment_user
                        }
                    }
                `}
                parameters={{id: userId}}
                ref={setQueryRef}
            >
                <ButtonElement
                    variant={buttonVariant}
                    size={buttonSize}
                    onClick={handleOpenOffcanvas}
                >
                    {buttonText || t("buttonText")}
                </ButtonElement>
            </LysQueryProvider>
        );
    }
);

GetAdminRestricted.displayName = "GetAdminRestricted";

export default GetAdminRestricted;