import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {
    CurrentSubscription,
    SubscribeClientManuallyRestrictedProps,
    SubscribeClientManuallyRestrictedRefInterface
} from "./types";
import {useSubscribeClientManuallyRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import SelectLicensePlanRestricted from "@/components/restrictedFeatures/SelectLicensePlanRestricted";
import SelectPlanVersionPriceRestricted from "@/components/restrictedFeatures/SelectPlanVersionPriceRestricted";
import SelectDiscountRestricted from "@/components/restrictedFeatures/SelectDiscountRestricted";
import {CommonTranslationKey} from "@/services/i18n/common";

/**
 * GraphQL mutation for placing a client on a manually billed subscription
 */
const SubscribeClientManuallyMutation = graphql`
    mutation SubscribeClientManuallyRestrictedMutation($id: ID!, $input: SubscribeManuallyInput!) {
        subscribeClientManually(id: $id, input: $input) {
            id
            isManuallyBilled
            commitmentEndDate
            amountDue
            grantedDiscount {
                value
                discount {
                    code
                }
                unit {
                    code
                }
            }
            billingMode {
                code
            }
            planVersion {
                version
                enabled
                plan {
                    code
                }
            }
            planVersionPrice {
                formatted
                period {
                    code
                }
                commitment {
                    code
                }
            }
        }
    }
`;

/**
 * GraphQL query for what the client has already signed
 *
 * The Founder Customer discount is exchanged for the acceptance of its terms.
 * Reading the proof here is what keeps the two together: an operator does not
 * have to remember who signed, and cannot forget to apply what was agreed.
 */
const ClientFounderAcceptanceQuery = graphql`
    query SubscribeClientManuallyRestrictedAcceptanceQuery($clientId: ID!) {
        allClientLegalAcceptances(clientId: $clientId, typeId: "FOUNDER_CUSTOMER", first: 1) {
            edges {
                node {
                    id
                    acceptedByEmail
                    createdAt
                    version {
                        versionNumber
                    }
                }
            }
        }
    }
`;

/**
 * Discount code of the Founder Customer programme
 */
const FOUNDER_CUSTOMER_DISCOUNT = "FC_DISCOUNT";

/**
 * Dialog content component for assigning an offer
 */
interface SubscribeDialogContentProps {
    subscriptionId: string;
    clientId: string;
    current?: CurrentSubscription;
    onUpdated?: () => void;
}

const SubscribeDialogContent: React.FC<SubscribeDialogContentProps> = ({
    subscriptionId,
    clientId,
    current,
    onUpdated
}) => {
    const {t, common} = useSubscribeClientManuallyRestrictedTranslations();
    const alertMessage = useAlertMessages();
    const dialog = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
    const [acceptanceRef, setAcceptanceRef] = useState<LysQueryRefInterface | null>(null);

    // The plan only narrows the price list; the mutation takes the price alone
    const [planId, setPlanId] = useState<string>("");
    const [priceId, setPriceId] = useState<string>("");
    // A discount is optional, and a subscription carries at most one
    const [discountId, setDiscountId] = useState<string>("");

    /**
     * Proof that the client signed the Founder Customer programme
     */
    const founderAcceptance = useMemo(() => {
        const data = acceptanceRef?.data as {
            allClientLegalAcceptances?: {
                edges: ReadonlyArray<{
                    node: {
                        acceptedByEmail: string;
                        createdAt: string;
                        version: {versionNumber: number} | null;
                    };
                }>;
            };
        } | undefined;

        return data?.allClientLegalAcceptances?.edges?.[0]?.node ?? null;
    }, [acceptanceRef?.data]);

    /**
     * What the client is on today, in one line
     */
    const currentSummary = useMemo(() => {
        if (!current?.price) {
            return t("currentNone");
        }

        const planLabel = current.planCode
            ? common(current.planCode as CommonTranslationKey) || current.planCode
            : "";

        return [planLabel, current.version ? `v${current.version}` : null, current.price]
            .filter(Boolean)
            .join(" · ");
    }, [current, t, common]);

    /**
     * Impose the programme's discount once the client signed it: an operator
     * should not have to remember it, and must not be able to forget it
     */
    useEffect(() => {
        if (founderAcceptance && discountId !== FOUNDER_CUSTOMER_DISCOUNT) {
            setDiscountId(FOUNDER_CUSTOMER_DISCOUNT);
        }
    }, [founderAcceptance, discountId]);

    /**
     * Load what the client signed
     */
    useEffect(() => {
        if (acceptanceRef?.hasPermission && !acceptanceRef?.isLoading && !acceptanceRef?.data) {
            acceptanceRef?.load();
        }
    }, [acceptanceRef?.hasPermission, acceptanceRef?.isLoading, acceptanceRef?.data, acceptanceRef?.load]);

    /**
     * Handle the plan change: the selected price belongs to the previous plan
     */
    const handlePlanChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlanId(e.target.value);
        setPriceId("");
    }, []);

    /**
     * Handle confirmation
     */
    const handleSubmit = useCallback(() => {
        if (!mutationRef?.commit || !priceId) return;

        mutationRef.commit({
            variables: {
                id: subscriptionId,
                input: {
                    planVersionPriceId: priceId,
                    discountId: discountId || null
                }
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
    }, [mutationRef, subscriptionId, priceId, discountId, alertMessage, t, dialog, onUpdated]);

    return (
        <LysQueryProvider
            query={ClientFounderAcceptanceQuery}
            parameters={{clientId}}
            ref={setAcceptanceRef}
        >
        <LysMutationProvider
            mutation={SubscribeClientManuallyMutation}
            notPermissionDisplayType="show"
            ref={setMutationRef}
        >
            <CardElement
                variant="flat"
                padding="lg"
            >
                {/* What the client is on today */}
                <div className="mb-4">
                    <div className="text-muted small">{t("currentTitle")}</div>
                    <div className="fw-bold">{currentSummary}</div>

                    {current?.commitmentEndDate && (
                        <div className="text-muted small">
                            {t("currentCommittedUntil", {
                                values: {date: new Date(current.commitmentEndDate).toLocaleDateString()}
                            })}
                        </div>
                    )}

                    {current?.price && !current.versionEnabled && (
                        <div className="text-warning small mt-2">
                            <i className="bi bi-exclamation-triangle me-1" />
                            {t("retiredWarning")}
                        </div>
                    )}
                </div>

                <p className="mb-3">
                    <strong>{t("dialogLead")}</strong> {t("dialogMessage")}
                </p>

                {/* Offer, then price within that offer */}
                <div className="mb-3">
                    <SelectLicensePlanRestricted
                        id="subscribe-client-plan"
                        value={planId}
                        onChange={handlePlanChange}
                        isFloatingLabel
                    />
                </div>

                <div className="mb-3">
                    <SelectPlanVersionPriceRestricted
                        id="subscribe-client-price"
                        planId={planId || null}
                        value={priceId}
                        onChange={(e) => setPriceId(e.target.value)}
                        isFloatingLabel
                    />
                </div>

                <div className="mb-4">
                    <SelectDiscountRestricted
                        id="subscribe-client-discount"
                        value={discountId}
                        onChange={(e) => setDiscountId(e.target.value)}
                        disabled={!!founderAcceptance}
                        isFloatingLabel
                    />

                    {founderAcceptance && (
                        <div className="text-muted small mt-2">
                            <i className="bi bi-patch-check me-1" />
                            {t("founderSigned", {
                                values: {
                                    email: founderAcceptance.acceptedByEmail,
                                    date: new Date(founderAcceptance.createdAt).toLocaleDateString(),
                                    version: String(founderAcceptance.version?.versionNumber ?? "-")
                                }
                            })}
                        </div>
                    )}
                </div>

                <div className="d-grid">
                    <ButtonElement
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!mutationRef?.commit || !priceId || mutationRef?.isInFlight}
                    >
                        {t("submit")}
                    </ButtonElement>
                </div>
            </CardElement>
        </LysMutationProvider>
        </LysQueryProvider>
    );
};

/**
 * SubscribeClientManuallyRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected assignment of an offer to a client
 * - Dialog stating what the client is on before choosing what to move them to
 * - subscribeClientManually mutation, which also switches the subscription to
 *   manual collection
 *
 * The price carries the plan version, the periodicity, the currency and the
 * commitment, so it is the only value the mutation needs.
 */
const SubscribeClientManuallyRestricted = forwardRef<
    SubscribeClientManuallyRestrictedRefInterface,
    SubscribeClientManuallyRestrictedProps
>(({subscriptionId, clientId, current, display = true, onUpdated}, ref) => {
    const {t} = useSubscribeClientManuallyRestrictedTranslations();
    const {open} = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /**
     * Dialog unique key
     */
    const dialogKey = useMemo(() => `subscribe-client-manually-${subscriptionId}`, [subscriptionId]);

    /**
     * Handle opening the dialog
     */
    const handleOpen = useCallback(() => {
        open({
            uniqueKey: dialogKey,
            title: t("dialogTitle"),
            body: SubscribeDialogContent,
            bodyProps: {
                subscriptionId,
                clientId,
                current,
                onUpdated
            },
            size: "md",
            syncWithUrl: false
        });
    }, [dialogKey, t, open, subscriptionId, clientId, current, onUpdated]);

    /**
     * Expose hasPermission and open via ref
     */
    useImperativeHandle(ref, () => ({
        hasPermission: !!mutationRef?.commit,
        open: handleOpen
    }), [mutationRef?.commit, handleOpen]);

    return (
        <LysMutationProvider
            mutation={SubscribeClientManuallyMutation}
            notPermissionDisplayType="hide"
            ref={setMutationRef}
        >
            {display && mutationRef?.commit && (
                <ButtonElement
                    variant="primary"
                    size="sm"
                    onClick={handleOpen}
                >
                    <i className="bi bi-credit-card me-2" />
                    {t("submit")}
                </ButtonElement>
            )}
        </LysMutationProvider>
    );
});

SubscribeClientManuallyRestricted.displayName = "SubscribeClientManuallyRestricted";

export default SubscribeClientManuallyRestricted;
