import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {
    AddClientUserToSubscriptionRestrictedProps,
    AddClientUserToSubscriptionRestrictedRefInterface
} from "./types";
import {useAddClientUserToSubscriptionRestrictedTranslations} from "./translations";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * GraphQL mutation for adding client user to subscription
 */
const AddClientUserToSubscriptionMutation = graphql`
    mutation AddClientUserToSubscriptionRestrictedMutation($id: ID!) {
        addClientUserToSubscription(id: $id) {
            id
            isLicensed
        }
    }
`;

/**
 * AddClientUserToSubscriptionRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected add to subscription action
 * - GraphQL mutation via LysMutationProvider
 * - Exposes open() via ref for programmatic triggering
 * - Optional display prop to hide default button
 */
const AddClientUserToSubscriptionRestricted = forwardRef<
    AddClientUserToSubscriptionRestrictedRefInterface,
    AddClientUserToSubscriptionRestrictedProps
>(({clientUserId, display = true, onCompleted}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useAddClientUserToSubscriptionRestrictedTranslations();
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
    const handleAddToSubscription = useCallback(() => {
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
        open: handleAddToSubscription
    }), [mutationRef?.commit, handleAddToSubscription]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysMutationProvider
            mutation={AddClientUserToSubscriptionMutation}
            ref={setMutationRef}
        >
            {display && mutationRef?.commit && (
                <ButtonElement
                    variant="outline-success"
                    size="sm"
                    onClick={handleAddToSubscription}
                >
                    <i className="bi bi-plus-circle me-1" />
                    {t("buttonText")}
                </ButtonElement>
            )}
        </LysMutationProvider>
    );
});

AddClientUserToSubscriptionRestricted.displayName = "AddClientUserToSubscriptionRestricted";

export default AddClientUserToSubscriptionRestricted;