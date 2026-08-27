import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {
    RemoveClientUserFromSubscriptionRestrictedProps,
    RemoveClientUserFromSubscriptionRestrictedRefInterface
} from "./types";
import {useRemoveClientUserFromSubscriptionRestrictedTranslations} from "./translations";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * GraphQL mutation for removing client user from subscription
 */
const RemoveClientUserFromSubscriptionMutation = graphql`
    mutation RemoveClientUserFromSubscriptionRestrictedMutation($id: ID!) {
        removeClientUserFromSubscription(id: $id) {
            id
            isLicensed
        }
    }
`;

/**
 * RemoveClientUserFromSubscriptionRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected remove from subscription action
 * - GraphQL mutation via LysMutationProvider
 * - Exposes open() via ref for programmatic triggering
 * - Optional display prop to hide default button
 */
const RemoveClientUserFromSubscriptionRestricted = forwardRef<
    RemoveClientUserFromSubscriptionRestrictedRefInterface,
    RemoveClientUserFromSubscriptionRestrictedProps
>(({clientUserId, display = true, onCompleted}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useRemoveClientUserFromSubscriptionRestrictedTranslations();
    const alertMessages = useAlertMessages();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle mutation success
     */
    const handleSuccess = useCallback(() => {
        alertMessages.merge([{
            text: t("successMessage"),
            level: "SUCCESS"
        }]);
        onCompleted?.();
    }, [alertMessages, t, onCompleted]);

    /**
     * Execute the mutation
     */
    const handleRemoveFromSubscription = useCallback(() => {
        if (mutationRef?.commit) {
            mutationRef.commit({
                variables: {id: clientUserId},
                onCompleted: handleSuccess
            });
        }
    }, [mutationRef, clientUserId, handleSuccess]);

    /*******************************************************************************************************************
     *                                                  IMPERATIVE HANDLE
     ******************************************************************************************************************/

    /**
     * Expose hasPermission and open via ref
     */
    useImperativeHandle(ref, () => ({
        hasPermission: !!mutationRef?.commit,
        open: handleRemoveFromSubscription
    }), [mutationRef?.commit, handleRemoveFromSubscription]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysMutationProvider
            mutation={RemoveClientUserFromSubscriptionMutation}
            ref={setMutationRef}
        >
            {display && mutationRef?.commit && (
                <ButtonElement
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveFromSubscription}
                >
                    <i className="bi bi-dash-circle me-1" />
                    {t("buttonText")}
                </ButtonElement>
            )}
        </LysMutationProvider>
    );
});

RemoveClientUserFromSubscriptionRestricted.displayName = "RemoveClientUserFromSubscriptionRestricted";

export default RemoveClientUserFromSubscriptionRestricted;