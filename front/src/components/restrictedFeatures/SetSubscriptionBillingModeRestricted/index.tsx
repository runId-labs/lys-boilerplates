import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {
    SetSubscriptionBillingModeRestrictedProps,
    SetSubscriptionBillingModeRestrictedRefInterface
} from "./types";
import {useSetSubscriptionBillingModeRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * GraphQL mutation for changing how a subscription is collected
 */
const SetSubscriptionBillingModeMutation = graphql`
    mutation SetSubscriptionBillingModeRestrictedMutation($id: ID!, $billingModeId: String!) {
        setSubscriptionBillingMode(id: $id, billingModeId: $billingModeId) {
            id
            isManuallyBilled
            billingMode {
                code
            }
        }
    }
`;

const MANUAL_BILLING = "MANUAL";
const PROVIDER_BILLING = "PROVIDER";

/**
 * Dialog content component for changing the billing mode
 */
interface SetBillingModeDialogContentProps {
    subscriptionId: string;
    onUpdated?: () => void;
}

const SetBillingModeDialogContent: React.FC<SetBillingModeDialogContentProps> = ({
    subscriptionId,
    onUpdated
}) => {
    const {t} = useSetSubscriptionBillingModeRestrictedTranslations();
    const alertMessage = useAlertMessages();
    const dialog = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /**
     * Handle confirmation
     */
    const handleConfirm = useCallback(() => {
        if (!mutationRef?.commit) return;

        mutationRef.commit({
            variables: {
                id: subscriptionId,
                billingModeId: MANUAL_BILLING
            },
            onCompleted: () => {
                alertMessage.merge([{
                    text: t("success"),
                    level: "SUCCESS"
                }]);
                dialog.close();
                onUpdated?.();
            },
            onError: (error) => {
                alertMessage.merge([{
                    text: error.message || t("error"),
                    level: "ERROR"
                }]);
            }
        });
    }, [mutationRef, subscriptionId, alertMessage, t, dialog, onUpdated]);

    return (
        <LysMutationProvider
            mutation={SetSubscriptionBillingModeMutation}
            notPermissionDisplayType="show"
            ref={setMutationRef}
        >
            <CardElement
                variant="flat"
                padding="lg"
            >
                <div className="mb-4">
                    <p className="mb-2">{t("effect")}</p>
                    <p className="text-muted small mb-0">{t("reverse")}</p>

                    <p className="text-warning small mt-2 mb-0">
                        <i className="bi bi-exclamation-triangle me-1" />
                        {t("blocked")}
                    </p>
                </div>

                <div className="d-grid">
                    <ButtonElement
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={!mutationRef?.commit || mutationRef?.isInFlight}
                    >
                        {t("submit")}
                    </ButtonElement>
                </div>
            </CardElement>
        </LysMutationProvider>
    );
};

/**
 * SetSubscriptionBillingModeRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected change of how a subscription is collected
 * - Dialog explaining both modes and what the switch does, before committing
 * - setSubscriptionBillingMode mutation
 *
 * Only offered on a subscription billed by the provider: the way back is not a
 * gesture, the client's first successful online payment sets the mode itself.
 *
 * Switching to manual is refused by the back office while the payment provider
 * still collects, which the dialog announces rather than letting the operator
 * discover it through an error.
 */
const SetSubscriptionBillingModeRestricted = forwardRef<
    SetSubscriptionBillingModeRestrictedRefInterface,
    SetSubscriptionBillingModeRestrictedProps
>(({subscriptionId, billingModeCode, display = true, onUpdated}, ref) => {
    const {t} = useSetSubscriptionBillingModeRestrictedTranslations();
    const {open} = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /**
     * Dialog unique key
     */
    const dialogKey = useMemo(() => `set-billing-mode-${subscriptionId}`, [subscriptionId]);

    /**
     * Handle opening the dialog
     */
    const handleOpen = useCallback(() => {
        open({
            uniqueKey: dialogKey,
            title: t("dialogTitle"),
            body: SetBillingModeDialogContent,
            bodyProps: {
                subscriptionId,
                onUpdated
            },
            size: "md",
            syncWithUrl: false
        });
    }, [dialogKey, t, open, subscriptionId, onUpdated]);

    /**
     * Expose hasPermission and open via ref
     */
    // Switching to manual is the only deliberate move: the way back happens on
    // its own, when the client's first online payment succeeds
    const isRelevant = billingModeCode === PROVIDER_BILLING;

    useImperativeHandle(ref, () => ({
        hasPermission: isRelevant && !!mutationRef?.commit,
        open: handleOpen
    }), [isRelevant, mutationRef?.commit, handleOpen]);

    return (
        <LysMutationProvider
            mutation={SetSubscriptionBillingModeMutation}
            notPermissionDisplayType="hide"
            ref={setMutationRef}
        >
            {display && isRelevant && mutationRef?.commit && (
                <ButtonElement
                    variant="secondary"
                    size="sm"
                    onClick={handleOpen}
                >
                    {t("submit")}
                </ButtonElement>
            )}
        </LysMutationProvider>
    );
});

SetSubscriptionBillingModeRestricted.displayName = "SetSubscriptionBillingModeRestricted";

export default SetSubscriptionBillingModeRestricted;
