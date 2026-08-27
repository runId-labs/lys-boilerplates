import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {GetSuperUserRestrictedProps, GetSuperUserRestrictedRefInterface} from "./types";
import {useGetSuperUserRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import SuperUserManagementTabsFeature from "@/components/features/SuperUserManagementTabsFeature";
import ButtonElement from "@/components/elements/ButtonElement";
import type {GetSuperUserRestrictedQuery} from "./__generated__/GetSuperUserRestrictedQuery.graphql";

/**
 * GetSuperUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected super user data access via LysQueryProvider
 * - Button or custom trigger to open offcanvas with super user management tabs
 * - Personal information and email management (no roles)
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch super user data
 * - Manages offcanvas dialog via LysDialogProvider
 * - Provides tabbed interface for super user management
 */
const GetSuperUserRestricted = forwardRef<GetSuperUserRestrictedRefInterface, GetSuperUserRestrictedProps>(
    ({userId, buttonText, buttonVariant = "primary", buttonSize = "sm", renderTrigger}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useGetSuperUserRestrictedTranslations();
        const {open, update} = useLysDialog();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<GetSuperUserRestrictedQuery> | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Dialog unique key used for open and update operations
         */
        const dialogKey = useMemo(() => `super-user-management-${userId}`, [userId]);

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
                body: SuperUserManagementTabsFeature,
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
            if (queryRef?.data?.superUser) {
                update(dialogKey, {
                    bodyProps: {
                        userFragmentRef: queryRef.data.superUser
                    },
                    loading: false
                });
            }
        }, [dialogKey, queryRef?.data?.superUser, update]);

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
                    query GetSuperUserRestrictedQuery($id: ID!) {
                        superUser(id: $id) {
                            id
                            ...UpdateSuperUserPrivateDataRestrictedFragment_user
                            ...UpdateSuperUserEmailRestrictedFragment_user
                        }
                    }
                `}
                parameters={{id: userId}}
                ref={setQueryRef}
            >
                {renderTrigger ? (
                    renderTrigger(handleOpenOffcanvas)
                ) : (
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

GetSuperUserRestricted.displayName = "GetSuperUserRestricted";

export default GetSuperUserRestricted;