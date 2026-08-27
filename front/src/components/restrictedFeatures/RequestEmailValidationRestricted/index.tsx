import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {RequestEmailValidationRestrictedProps, RequestEmailValidationRestrictedRefInterface} from "./types";
import {useRequestEmailValidationRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * RequestEmailValidationRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected email validation request button
 * - GraphQL mutation via LysMutationProvider
 * - Success/error handling
 *
 * This is a restricted feature component (Layer 3) that:
 * - Renders only a button (no CardElement)
 * - Manages GraphQL mutation for sendEmailVerification
 * - Hidden if email already validated or no permission
 */
const RequestEmailValidationRestricted = forwardRef<RequestEmailValidationRestrictedRefInterface, RequestEmailValidationRestrictedProps>(
    ({userId, validatedAt}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useRequestEmailValidationRestrictedTranslations();
        const alertMessage = useAlertMessages();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle send verification email
         */
        const handleSendVerification = useCallback(() => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    id: userId
                },
                onCompleted: () => {
                    // Relay automatically updates cache with mutation response
                    // Show success message
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);
                }
            });
        }, [mutationRef, userId, alertMessage, t]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

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
                    mutation RequestEmailValidationRestrictedMutation($id: ID!) {
                        sendEmailVerification(id: $id) {
                            id
                            clientId
                            emailAddress {
                                id
                                address
                                createdAt
                                updatedAt
                                validatedAt
                                lastValidationRequestAt
                            }
                            status {
                                id
                                code
                            }
                            language {
                                id
                                code
                            }
                            privateData {
                                firstName
                                lastName
                                gender {
                                    id
                                    code
                                }
                                id
                            }
                        }
                    }
                `}
                ref={setMutationRef}
            >
                {mutationRef?.commit && !validatedAt && (
                    <ButtonElement
                        variant="outline-primary"
                        size="sm"
                        onClick={handleSendVerification}
                        isLoading={mutationRef.isInFlight}
                        leftIcon={<i className="bi bi-envelope-check"></i>}
                    >
                        {t("verifyButton")}
                    </ButtonElement>
                )}
            </LysMutationProvider>
        );
    }
);

RequestEmailValidationRestricted.displayName = "RequestEmailValidationRestricted";

export default RequestEmailValidationRestricted;