import {forwardRef, useCallback, useEffect, useState} from "react";
import {graphql} from "react-relay";
import {RequestForgottenPasswordResetRestrictedProps} from "./types";
import {LysMutationProvider, useAlertMessages, useLysDialog, HasPermissionRefInterface, LysMutationRefInterface} from "lys-front/providers";
import RequestForgottenPasswordResetFeature from "@/components/features/RequestForgottenPasswordResetFeature";
import {useRequestForgottenPasswordResetTranslations} from "@/components/features/RequestForgottenPasswordResetFeature/translations";

/**
 * GraphQL mutation for password reset request
 */
const RequestPasswordResetMutation = graphql`
  mutation RequestForgottenPasswordResetRestrictedMutation($email: String!) {
    requestPasswordReset(inputs: {email: $email}) {
      success
    }
  }
`;

/**
 * RequestForgottenPasswordResetRestricted component
 *
 * Permission-protected password reset request feature.
 * - Uses LysMutationProvider with requestPasswordReset mutation
 * - Shows RequestForgottenPasswordResetFeature if permission granted
 * - Handles success/error alerts via AlertMessageProvider
 * - Closes dialog on success
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps permission checking logic
 * - Manages GraphQL mutations
 * - Handles mutation lifecycle (onCompleted, onError)
 * - Exposes hasPermission via ref
 */
const RequestForgottenPasswordResetRestricted = forwardRef<HasPermissionRefInterface, RequestForgottenPasswordResetRestrictedProps>(
    ({}, ref) => {

        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const alertMessage = useAlertMessages();
        const {close: closeDialog} = useLysDialog();
        const {t} = useRequestForgottenPasswordResetTranslations();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [innerRef, setInnerRef] = useState<LysMutationRefInterface | null>(null)

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        useEffect(() => {
            const data = {
                hasPermission: !!innerRef?.commit
            }
            if (typeof ref === 'function') {
                ref(data)
            } else if (ref) {
                ref.current = data
            }
        },[innerRef?.commit, ref])

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        const handleSubmit = useCallback((email: string) => {
            innerRef?.commit?.({
                variables: {email},
                onCompleted: () => {
                    closeDialog();
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);
                }
            });
        }, [innerRef, alertMessage, closeDialog, t]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={RequestPasswordResetMutation}
                ref={setInnerRef}
            >
                {
                    innerRef?.commit && (
                        <RequestForgottenPasswordResetFeature
                            onSubmit={handleSubmit}
                            isLoading={innerRef.isInFlight}
                        />
                    )
                }
            </LysMutationProvider>
        );
    }
);

RequestForgottenPasswordResetRestricted.displayName = "RequestForgottenPasswordResetRestricted";

export default RequestForgottenPasswordResetRestricted;
