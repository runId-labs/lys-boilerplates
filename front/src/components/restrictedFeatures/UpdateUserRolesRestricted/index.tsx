import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {graphql} from "react-relay";
import {UpdateUserRolesRestrictedProps, UpdateUserRolesRestrictedRefInterface} from "./types";
import {useUpdateUserRolesRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {useFormEditMode} from "@/hooks/useFormEditMode";
import {CommonTranslationKey} from "@/services/i18n/common";
import {LysMutationProvider} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import UpdateUserRolesFormFeature from "@/components/features/UpdateUserRolesFormFeature";
import {UpdateUserRolesFormData, UpdateUserRolesFormFeatureRef} from "@/components/features/UpdateUserRolesFormFeature/types";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import type {UpdateUserRolesRestrictedQuery} from "./__generated__/UpdateUserRolesRestrictedQuery.graphql";

/**
 * GraphQL query for all available roles
 */
const AllRolesQuery = graphql`
    query UpdateUserRolesRestrictedQuery {
        allRoles(enabled: true, orderBy: {code: true}) {
            edges {
                node {
                    code
                }
            }
        }
    }
`;

/**
 * UpdateUserRolesRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected user roles update
 * - GraphQL mutation via LysMutationProvider
 * - GraphQL query for available roles via LysQueryProvider
 * - Success/error handling
 * - Checkbox-based role selection
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps UpdateUserRolesFormFeature with permission logic
 * - Manages GraphQL mutation for updateUserRoles
 * - Fetches available roles for checkbox options
 * - Provides success notifications
 */
const UpdateUserRolesRestricted = forwardRef<UpdateUserRolesRestrictedRefInterface, UpdateUserRolesRestrictedProps>(
    ({userId, roleCodes, footer, onCompleted}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t, common} = useUpdateUserRolesRestrictedTranslations();
        const alertMessage = useAlertMessages();
        const {isEditing, disabled, startEdit, cancelEdit, submitEdit} = useFormEditMode();

        /*******************************************************************************************************************
         *                                                  REFS
         ******************************************************************************************************************/

        const formRef = useRef<UpdateUserRolesFormFeatureRef>(null);

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Transform GraphQL data to role options with translated labels
         */
        const roleOptions = useMemo(() => {
            const data = queryRef?.data as UpdateUserRolesRestrictedQuery["response"] | undefined;

            if (!data?.allRoles?.edges) {
                return [];
            }

            return data.allRoles.edges.map((edge) => ({
                code: edge.node.code,
                label: common(edge.node.code as CommonTranslationKey)
            }));
        }, [queryRef?.data, common]);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle form submission
         */
        const handleSubmit = useCallback((data: UpdateUserRolesFormData) => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    id: userId,
                    inputs: {
                        roleCodes: data.roleCodes
                    }
                },
                onCompleted: (response: any) => {
                    // Call parent's onCompleted callback if provided
                    if (onCompleted && response?.updateUserRoles) {
                        onCompleted(response.updateUserRoles);
                    }

                    // Show success message
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);

                    // Exit edit mode after successful submit
                    submitEdit();
                }
            });
        }, [mutationRef, userId, alertMessage, t, onCompleted, submitEdit]);

        /**
         * Handle cancel - reset form and exit edit mode
         */
        const handleCancel = useCallback(() => {
            formRef.current?.reset();
            cancelEdit();
        }, [cancelEdit]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Load roles query on mount when permission is granted
         */
        useEffect(() => {
            if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
                queryRef?.load();
            }
        }, [queryRef?.hasPermission, queryRef?.load]);

        /**
         * Expose hasPermission via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit
        }), [mutationRef?.commit]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={graphql`
                    mutation UpdateUserRolesRestrictedMutation($id: ID!, $inputs: UpdateUserRolesInput!) {
                        updateUserRoles(id: $id, inputs: $inputs) {
                            id
                            roles {
                                code
                            }
                        }
                    }
                `}
                ref={setMutationRef}
            >
                <LysQueryProvider
                    query={AllRolesQuery}
                    parameters={{}}
                    options={{fetchPolicy: 'store-or-network'}}
                    ref={setQueryRef}
                >
                    <CardElement
                        variant="flat"
                        padding="lg"
                        title={t("title")}
                        actions={
                            !isEditing ? (
                                <ButtonElement onClick={startEdit} size="sm" variant="primary">
                                    <i className="bi bi-pencil me-2"></i>
                                    {t("edit")}
                                </ButtonElement>
                            ) : (
                                <ButtonElement onClick={handleCancel} size="sm" variant="outline-secondary">
                                    {t("cancel")}
                                </ButtonElement>
                            )
                        }
                        footer={footer}
                    >
                        <UpdateUserRolesFormFeature
                            ref={formRef}
                            roleOptions={roleOptions}
                            initialRoleCodes={roleCodes}
                            onSubmit={handleSubmit}
                            isLoading={mutationRef?.isInFlight || false}
                            disabled={disabled}
                        />
                    </CardElement>
                </LysQueryProvider>
            </LysMutationProvider>
        );
    }
);

UpdateUserRolesRestricted.displayName = "UpdateUserRolesRestricted";

export default UpdateUserRolesRestricted;