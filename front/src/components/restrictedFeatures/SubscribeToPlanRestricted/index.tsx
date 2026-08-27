import React, {useCallback, useState} from "react";
import {graphql} from "react-relay";
import {SubscribeToPlanRestrictedProps, SubscribeToPlanResult} from "./types";
import {useSubscribeToPlanRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * GraphQL mutation for subscribing to a plan
 */
const SubscribeToPlanMutation = graphql`
    mutation SubscribeToPlanRestrictedMutation(
        $input: SubscribeToPlanInput!
    ) {
        subscribeToPlan(input: $input) {
            success
            checkoutUrl
            effectiveDate
            prorataAmount
            error
        }
    }
`;

/**
 * Domain the payment provider hosts its checkout on
 */
const PROVIDER_DOMAIN = "mollie.com";

/**
 * SubscribeToPlanRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected subscription management
 * - Handles new subscriptions, upgrades (with prorata), and downgrades
 * - Payment redirect handling
 */
const SubscribeToPlanRestricted: React.FC<SubscribeToPlanRestrictedProps> = ({
    planVersionId,
    billingPeriod,
    commitmentId,
    renderTrigger,
    buttonText,
    onSuccess,
    onError
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useSubscribeToPlanRestrictedTranslations();
    const alertMessages = useAlertMessages();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle subscribe button click
     */
    const handleSubscribe = useCallback(() => {
        if (!mutationRef?.commit || mutationRef.isInFlight) return;

        // Build success URL - redirect to client admin page with payment status
        const successUrl = `${window.location.origin}/administration/client?payment=pending`;

        mutationRef.commit({
            variables: {
                input: {
                    planVersionId,
                    billingPeriod,
                    commitmentId,
                    successUrl
                }
            },
            onCompleted: (response: any) => {
                const result = response?.subscribeToPlan as SubscribeToPlanResult;

                if (result?.success) {
                    if (result.checkoutUrl) {
                        // Payment required - redirect to checkout (validate domain first)
                        try {
                            const url = new URL(result.checkoutUrl);
                            // Suffix matching alone would also accept evilmollie.com
                            if (url.hostname !== PROVIDER_DOMAIN && !url.hostname.endsWith(`.${PROVIDER_DOMAIN}`)) {
                                alertMessages.merge([{text: t("errorGeneric"), level: "ERROR"}]);
                                return;
                            }
                        } catch {
                            alertMessages.merge([{text: t("errorGeneric"), level: "ERROR"}]);
                            return;
                        }
                        onSuccess?.(result);
                        window.location.href = result.checkoutUrl;
                    } else if (result.effectiveDate) {
                        // Downgrade scheduled - show success message
                        alertMessages.merge([{
                            text: t("downgradeScheduled"),
                            level: "SUCCESS"
                        }]);
                        onSuccess?.(result);
                    } else {
                        // Immediate change (no prorata needed)
                        onSuccess?.(result);
                    }
                } else {
                    const errorMessage = result?.error
                        ? t(result.error as never, {fallbackToKey: true})
                        : t("errorGeneric");
                    alertMessages.merge([{text: errorMessage, level: "ERROR"}]);
                    onError?.(errorMessage);
                }
            },
            onError: (error: Error) => {
                const errorMessage = error.message || t("errorGeneric");
                alertMessages.merge([{text: errorMessage, level: "ERROR"}]);
                onError?.(errorMessage);
            }
        });
    }, [mutationRef, planVersionId, billingPeriod, commitmentId, onSuccess, onError, t, alertMessages]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    const isLoading = mutationRef?.isInFlight || false;

    return (
        <LysMutationProvider
            mutation={SubscribeToPlanMutation}
            ref={setMutationRef}
        >
            {renderTrigger ? (
                renderTrigger(handleSubscribe, isLoading)
            ) : (
                <ButtonElement
                    variant="primary"
                    onClick={handleSubscribe}
                    isLoading={isLoading}
                >
                    {buttonText || t("buttonText")}
                </ButtonElement>
            )}
        </LysMutationProvider>
    );
};

SubscribeToPlanRestricted.displayName = "SubscribeToPlanRestricted";

export default SubscribeToPlanRestricted;