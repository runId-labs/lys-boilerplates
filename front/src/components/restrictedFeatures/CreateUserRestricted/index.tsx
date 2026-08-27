import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {graphql} from "react-relay";
import {CreateUserRestrictedProps, CreateUserRestrictedRefInterface} from "./types";
import {useCreateUserRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {CommonTranslationKey} from "@/services/i18n/common";
import {LysMutationProvider} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import UserCreationFormFeature from "@/components/features/UserCreationFormFeature";
import {UserCreationFormData, UserCreationFormFeatureRef} from "@/components/features/UserCreationFormFeature/types";
import CardElement from "@/components/elements/CardElement";
import type {CreateUserRestrictedRolesQuery} from "./__generated__/CreateUserRestrictedRolesQuery.graphql";

/**
 * GraphQL mutation for creating a user with roles
 */
export const CreateUserMutation = graphql`
    mutation CreateUserRestrictedMutation($inputs: CreateUserWithRolesInput!) {
        createUser(inputs: $inputs) {
            id
            emailAddress {
                address
            }
            privateData {
                firstName
                lastName
            }
            roles {
                code
            }
        }
    }
`;

/**
 * GraphQL query for all available roles
 */
const AllRolesQuery = graphql`
    query CreateUserRestrictedRolesQuery {
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
 * CreateUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected user creation with role assignment
 * - GraphQL mutation via LysMutationProvider
 * - GraphQL query for available roles via LysQueryProvider
 * - Success/error handling
 * - Form validation
 *
 * This component renders the creation form directly.
 * It is designed to be used inside a dialog/panel opened by useCreateUserRestrictedAction hook.
 */
const CreateUserRestricted = forwardRef<CreateUserRestrictedRefInterface, CreateUserRestrictedProps>(
    ({onCompleted}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t, common} = useCreateUserRestrictedTranslations();
        const alertMessage = useAlertMessages();

        /*******************************************************************************************************************
         *                                                  REFS
         ******************************************************************************************************************/

        const formRef = useRef<UserCreationFormFeatureRef>(null);

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<CreateUserRestrictedRolesQuery> | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Transform GraphQL data to role options with translated labels
         */
        const roleOptions = useMemo(() => {
            if (!queryRef?.data?.allRoles?.edges) {
                return [];
            }

            return queryRef.data.allRoles.edges.map((edge) => ({
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
        const handleSubmit = useCallback((data: UserCreationFormData) => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    inputs: {
                        email: data.email,
                        password: data.password,
                        languageCode: data.languageCode,
                        firstName: data.firstName || null,
                        lastName: data.lastName || null,
                        genderCode: data.genderCode || null,
                        roleCodes: data.roleCodes || null
                    }
                },
                onCompleted: (response: any) => {
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);

                    // Call external callback (hook handles dialog close)
                    if (onCompleted && response?.createUser) {
                        onCompleted(response.createUser);
                    }
                }
            });
        }, [mutationRef, alertMessage, t, onCompleted]);

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
                mutation={CreateUserMutation}
                ref={setMutationRef}
            >
                <LysQueryProvider
                    query={AllRolesQuery}
                    parameters={{}}
                    options={{fetchPolicy: 'store-or-network'}}
                    ref={setQueryRef}
                >
                    {mutationRef?.commit && (
                        <CardElement variant="flat" padding="lg">
                            <UserCreationFormFeature
                                ref={formRef}
                                onSubmit={handleSubmit}
                                isLoading={mutationRef.isInFlight}
                                roleOptions={roleOptions}
                            />
                        </CardElement>
                    )}
                </LysQueryProvider>
            </LysMutationProvider>
        );
    }
);

CreateUserRestricted.displayName = "CreateUserRestricted";

export default CreateUserRestricted;