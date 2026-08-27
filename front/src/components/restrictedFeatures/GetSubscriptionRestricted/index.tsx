import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {GetSubscriptionRestrictedProps, GetSubscriptionRestrictedRefInterface} from "./types";
import {useGetSubscriptionRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import SubscriptionFormFeature from "@/components/features/SubscriptionFormFeature";
import ListActiveLicensePlansRestricted from "@/components/restrictedFeatures/ListActiveLicensePlansRestricted";
import SubscribeToPlanRestricted from "@/components/restrictedFeatures/SubscribeToPlanRestricted";
import "@/components/features/SubscriptionFormFeature/SubscriptionFormFeatureFragment";
import type {GetSubscriptionRestrictedQuery} from "./__generated__/GetSubscriptionRestrictedQuery.graphql";
import type {SubscriptionFormFeatureFragment_subscription$key} from "@/components/features/SubscriptionFormFeature/__generated__/SubscriptionFormFeatureFragment_subscription.graphql";
import type {BillingPeriod} from "@/components/restrictedFeatures/SubscribeToPlanRestricted/types";
import type {SelectedPlanDetails} from "@/components/restrictedFeatures/ListActiveLicensePlansRestricted/types";
import type {CommonTranslationKey} from "@/services/i18n/common";

/**
 * GraphQL query for fetching subscription data
 */
export const SubscriptionQuery = graphql`
    query GetSubscriptionRestrictedQuery($id: ID!) {
        subscription(id: $id) {
            createdAt
            updatedAt
            planVersion {
                id
                isFree
            }
            ...SubscriptionFormFeatureFragment_subscription
        }
    }
`;

/**
 * Plan selection panel component for offcanvas body
 */
interface PlanSelectionPanelProps {
    currentPlanVersionId: string | null;
}

interface SelectedPlanState {
    planVersionId: string;
    billingPeriod: BillingPeriod;
    commitmentId: string;
    planName: string;
    price: string;
    isFree: boolean;
}

const PlanSelectionPanel: React.FC<PlanSelectionPanelProps> = ({
    currentPlanVersionId
}) => {
    const {t, common} = useGetSubscriptionRestrictedTranslations();
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlanState | null>(null);

    const handleSelectPlan = useCallback((details: SelectedPlanDetails) => {
        setSelectedPlan({
            planVersionId: details.planVersionId,
            billingPeriod: details.billingPeriod as BillingPeriod,
            commitmentId: details.commitmentId,
            planName: details.planName,
            price: details.price,
            isFree: details.isFree
        });
    }, []);

    const handleBack = useCallback(() => {
        setSelectedPlan(null);
    }, []);

    if (selectedPlan) {
        return (
            <div className="d-flex flex-column gap-4">
                <CardElement variant="bordered" padding="lg">
                    <h5 className="mb-4">{t("checkoutSummaryTitle")}</h5>

                    <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted">{t("selectedPlan")}</span>
                        <span className="fw-bold">{selectedPlan.planName}</span>
                    </div>

                    <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted">{t("billingPeriodLabel")}</span>
                        <span className="fw-bold">
                            {selectedPlan.billingPeriod === "MONTHLY" ? t("monthly") : t("yearly")}
                        </span>
                    </div>

                    <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted">{t("commitmentLabel")}</span>
                        <span className="fw-bold">
                            {common(selectedPlan.commitmentId as CommonTranslationKey, {fallbackToKey: true})}
                        </span>
                    </div>

                    <div className="d-flex justify-content-between py-3">
                        <span className="fw-bold fs-5">{t("totalPrice")}</span>
                        <span className="fw-bold fs-5">
                            {selectedPlan.isFree ? t("free") : selectedPlan.price}
                        </span>
                    </div>
                </CardElement>

                <div className="d-flex gap-3">
                    <ButtonElement
                        variant="outline-secondary"
                        onClick={handleBack}
                        className="flex-grow-1"
                    >
                        <i className="bi bi-arrow-left me-2" />
                        {t("backToPlans")}
                    </ButtonElement>

                    {/* Only a plan the client can check out reaches this summary:
                        a paid offer opens its quote request from the plan list
                        while no provider collects */}
                    <SubscribeToPlanRestricted
                        planVersionId={selectedPlan.planVersionId}
                        billingPeriod={selectedPlan.billingPeriod}
                        commitmentId={selectedPlan.commitmentId}
                        renderTrigger={(onClick, isLoading) => (
                            <ButtonElement
                                variant="primary"
                                onClick={onClick}
                                isLoading={isLoading}
                                leftIcon={<i className="bi bi-credit-card"></i>}
                                className="flex-grow-1"
                            >
                                {selectedPlan.isFree ? t("free") : selectedPlan.price}
                            </ButtonElement>
                        )}
                    />
                </div>
            </div>
        );
    }

    return (
        <ListActiveLicensePlansRestricted
            currentPlanVersionId={currentPlanVersionId}
            onSelectPlan={handleSelectPlan}
        />
    );
};

/**
 * Subscription details panel component for offcanvas body
 */
interface SubscriptionDetailsPanelProps {
    subscriptionRef: SubscriptionFormFeatureFragment_subscription$key | null;
    createdAt: string | null;
    updatedAt: string | null;
    currentPlanVersionId: string | null;
    isFree: boolean;
    allowPlanChange: boolean;
}

const SubscriptionDetailsPanel: React.FC<SubscriptionDetailsPanelProps> = ({
    subscriptionRef,
    createdAt,
    updatedAt,
    currentPlanVersionId,
    isFree,
    allowPlanChange
}) => {
    const {t, common} = useGetSubscriptionRestrictedTranslations();
    const {open} = useLysDialog();

    const handleOpenPlanSelection = useCallback(() => {
        open({
            uniqueKey: "plan-selection",
            title: t("planSelectionTitle"),
            body: PlanSelectionPanel,
            bodyProps: {
                currentPlanVersionId
            },
            placement: "end",
            size: "xl"
        });
    }, [open, t, currentPlanVersionId]);

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return common("notAvailable");
        return new Date(dateString).toLocaleDateString();
    };

    const footerContent = (
        <div className="text-muted small">
            <div>{t("createdAt", { values: { date: formatDate(createdAt) } })}</div>
            <div>{t("updatedAt", { values: { date: formatDate(updatedAt) } })}</div>
        </div>
    );

    // The plan selection is the client's own checkout path: an administrator
    // acting on a client's behalf subscribes them manually instead
    const headerActions = allowPlanChange ? (
        <ButtonElement
            variant="primary"
            size="sm"
            onClick={handleOpenPlanSelection}
        >
            {isFree ? t("upgradePlan") : t("changePlan")}
        </ButtonElement>
    ) : undefined;

    return (
        <CardElement
            variant="flat"
            padding="lg"
            title={t("cardTitle")}
            actions={headerActions}
            footer={footerContent}
        >
            {subscriptionRef && (
                <SubscriptionFormFeature
                    subscriptionRef={subscriptionRef}
                    disabled
                />
            )}
        </CardElement>
    );
};

/**
 * GetSubscriptionRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected subscription data access via LysQueryProvider
 * - Button to open offcanvas with subscription details
 * - Read-only form displaying subscription information
 */
const GetSubscriptionRestricted = forwardRef<GetSubscriptionRestrictedRefInterface, GetSubscriptionRestrictedProps>(
    ({
        subscriptionId,
        buttonText,
        buttonVariant = "outline-secondary",
        buttonSize = "sm",
        display = true,
        allowPlanChange = true
    }, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useGetSubscriptionRestrictedTranslations();
        const {open, update} = useLysDialog();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<GetSubscriptionRestrictedQuery> | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Dialog unique key used for open and update operations
         */
        const dialogKey = useMemo(() => `subscription-management-${subscriptionId}`, [subscriptionId]);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle button click - open offcanvas with loading, then load data
         */
        const handleOpenOffcanvas = useCallback(() => {
            // Open offcanvas immediately with loading state
            open({
                uniqueKey: dialogKey,
                title: t("offcanvasTitle"),
                body: SubscriptionDetailsPanel,
                bodyProps: {
                    subscriptionRef: null,
                    createdAt: null,
                    updatedAt: null,
                    currentPlanVersionId: null,
                    isFree: true,
                    allowPlanChange
                },
                placement: "end",
                size: "lg",
                loading: true
            });

            // Load data
            if (!queryRef?.isLoading) {
                queryRef?.load();
            }
        }, [dialogKey, t, open, queryRef]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Update dialog when query data changes (after query load)
         */
        useEffect(() => {
            if (queryRef?.data?.subscription) {
                update(dialogKey, {
                    bodyProps: {
                        subscriptionRef: queryRef.data.subscription,
                        createdAt: queryRef.data.subscription.createdAt,
                        updatedAt: queryRef.data.subscription.updatedAt,
                        currentPlanVersionId: queryRef.data.subscription.planVersion?.id ?? null,
                        isFree: queryRef.data.subscription.planVersion?.isFree ?? true,
                        allowPlanChange
                    },
                    loading: false
                });
            }
        }, [dialogKey, queryRef?.data?.subscription, update]);

        /**
         * Expose hasPermission and open via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!queryRef?.hasPermission,
            open: handleOpenOffcanvas
        }), [queryRef?.hasPermission, handleOpenOffcanvas]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysQueryProvider
                query={SubscriptionQuery}
                parameters={{id: subscriptionId}}
                ref={setQueryRef}
            >
                {display && (
                    <ButtonElement
                        variant={buttonVariant}
                        size={buttonSize}
                        onClick={handleOpenOffcanvas}
                    >
                        {buttonText || <i className="bi bi-credit-card" />}
                    </ButtonElement>
                )}
            </LysQueryProvider>
        );
    }
);

GetSubscriptionRestricted.displayName = "GetSubscriptionRestricted";

export default GetSubscriptionRestricted;