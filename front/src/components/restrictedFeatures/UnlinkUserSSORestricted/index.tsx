import React, {useCallback, useState} from "react";
import {graphql} from "react-relay";
import {UnlinkUserSSORestrictedProps} from "./types";
import {useUnlinkUserSSORestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import ConfirmationFeature from "@/components/features/ConfirmationFeature";

/**
 * GraphQL mutation for unlinking an SSO account
 */
export const UnlinkUserSSOMutation = graphql`
    mutation UnlinkUserSSORestrictedMutation($id: ID!) {
        deleteSsoLink(id: $id) {
            succeed
        }
    }
`;

/**
 * UnlinkUserSSORestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected SSO link deletion (OWNER access level)
 * - Danger confirmation dialog via ConfirmationFeature
 * - GraphQL mutation via LysMutationProvider
 *
 * Designed to be used as a dialog body opened by ManageUserSSORestricted.
 */
const UnlinkUserSSORestricted: React.FC<UnlinkUserSSORestrictedProps> = ({
    linkId,
    providerName,
    accessParameters,
    onCompleted
}) => {
    const {t} = useUnlinkUserSSORestrictedTranslations();
    const alertMessage = useAlertMessages();
    const dialog = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle unlink confirmation
     */
    const handleConfirm = useCallback(() => {
        if (!mutationRef?.commit) return;

        mutationRef.commit({
            variables: {
                id: linkId
            },
            onCompleted: () => {
                alertMessage.merge([{
                    text: t("successMessage"),
                    level: "SUCCESS"
                }]);
                dialog.close();
                onCompleted?.(linkId);
            },
            onError: (error: any) => {
                alertMessage.merge([{
                    text: error.message || t("errorMessage"),
                    level: "ERROR"
                }]);
            }
        });
    }, [mutationRef, linkId, alertMessage, t, dialog, onCompleted]);

    /**
     * Handle cancellation
     */
    const handleCancel = useCallback(() => {
        dialog.close();
    }, [dialog]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysMutationProvider
            mutation={UnlinkUserSSOMutation}
            accessParameters={accessParameters}
            ref={setMutationRef}
        >
            {mutationRef?.commit && (
                <ConfirmationFeature
                    message={t("confirmMessage").replace("{providerName}", providerName)}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    confirmText={t("confirmButton")}
                    confirmVariant="danger"
                    isLoading={mutationRef.isInFlight}
                />
            )}
        </LysMutationProvider>
    );
};

UnlinkUserSSORestricted.displayName = "UnlinkUserSSORestricted";

export default UnlinkUserSSORestricted;
