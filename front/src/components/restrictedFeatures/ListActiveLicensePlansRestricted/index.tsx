import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {ListActiveLicensePlansRestrictedProps, PlanVersionPrice} from "./types";
import {useListActiveLicensePlansRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import SelectCommitmentRestricted from "@/components/restrictedFeatures/SelectCommitmentRestricted";
import {CommonTranslationKey} from "@/services/i18n/common";
import {formatPrice} from "@/tools/formatTools";
import {isPaymentProviderEnabled} from "@/services/subscription";
import type {ListActiveLicensePlansRestrictedQuery} from "./__generated__/ListActiveLicensePlansRestrictedQuery.graphql";

/**
 * GraphQL query for fetching all active license plans
 */
const AllActiveLicensePlansQuery = graphql`
    query ListActiveLicensePlansRestrictedQuery {
        allActiveLicensePlans(first: 50) {
            edges {
                node {
                    id
                    code
                    description
                    currentVersion {
                        id
                        isFree
                        prices {
                            id
                            amount
                            period {
                                code
                            }
                            currency {
                                code
                                minorUnit
                            }
                            commitment {
                                code
                                durationMonths
                            }
                        }
                        rules {
                            id
                            limitValue
                            isQuota
                            isUnlimited
                            rule {
                                code
                            }
                        }
                    }
                }
            }
        }
    }
`;

/**
 * Billing periodicity the free plan is announced with, since it carries no price
 */
const DEFAULT_BILLING_PERIOD = "YEARLY";

/**
 * Commitment the free plan is subscribed to, since it binds nobody
 */
const NO_COMMITMENT = "NO_COMMITMENT";

/**
 * Find the price of a version for a commitment
 *
 * A version exposes one price per periodicity, currency and commitment. Only
 * one currency is served for now, and a tier committed over several years is
 * billed yearly, so the yearly price is preferred when a shorter periodicity
 * is also offered.
 */
const findPrice = (
    prices: readonly PlanVersionPrice[] | undefined,
    commitmentCode: string | null
): PlanVersionPrice | undefined => {
    if (!commitmentCode) return undefined;

    const matches = prices?.filter(price => price.commitment.code === commitmentCode) || [];

    return matches.find(price => price.period.code === DEFAULT_BILLING_PERIOD) || matches[0];
};

/**
 * Discount a price represents against the shortest commitment of the same plan
 *
 * The comparison stays within one periodicity: the saving a longer commitment
 * buys is what the client is choosing between, not the periodicity.
 */
const findDiscountPercent = (
    prices: readonly PlanVersionPrice[] | undefined,
    price: PlanVersionPrice | undefined
): number => {
    if (!price) return 0;

    const baseline = prices
        ?.filter(candidate => candidate.period.code === price.period.code)
        .sort((a, b) => a.commitment.durationMonths - b.commitment.durationMonths)[0];

    if (!baseline || baseline.amount <= 0 || baseline.amount <= price.amount) return 0;

    return Math.round(((baseline.amount - price.amount) / baseline.amount) * 100);
};

/**
 * ListActiveLicensePlansRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected access to license plans
 * - Display of available plans, priced against the selected commitment
 * - Plan selection for checkout
 */
const ListActiveLicensePlansRestricted: React.FC<ListActiveLicensePlansRestrictedProps> = ({
    currentPlanVersionId,
    onSelectPlan
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useListActiveLicensePlansRestrictedTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListActiveLicensePlansRestrictedQuery> | null>(null);
    const [commitmentCode, setCommitmentCode] = useState<string | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Extract plans from query data, sorted by price ascending (free first)
     */
    const plans = useMemo(() => {
        if (!queryRef?.data?.allActiveLicensePlans?.edges) return [];
        return queryRef.data.allActiveLicensePlans.edges
            .map(edge => edge.node)
            .filter(node => node.currentVersion !== null)
            .sort((a, b) => {
                // Free plans first
                if (a.currentVersion?.isFree && !b.currentVersion?.isFree) return -1;
                if (!a.currentVersion?.isFree && b.currentVersion?.isFree) return 1;
                // Then sort by the price of the selected commitment, ascending
                const priceA = findPrice(a.currentVersion?.prices, commitmentCode)?.amount || 0;
                const priceB = findPrice(b.currentVersion?.prices, commitmentCode)?.amount || 0;
                return priceA - priceB;
            });
    }, [queryRef?.data, commitmentCode]);

    /**
     * Calculate column class based on number of plans (max 4 per row)
     */
    const columnClass = useMemo(() => {
        const count = Math.min(plans.length, 4);
        if (count <= 1) return "col-12";
        if (count === 2) return "col-12 col-md-6";
        if (count === 3) return "col-12 col-md-4";
        return "col-12 col-md-6 col-lg-3"; // 4 cards
    }, [plans.length]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle plan selection
     *
     * The free plan carries no price: it is announced with the default
     * periodicity and binds the client to nothing.
     */
    const handleSelectPlan = useCallback((
        planVersionId: string,
        planCode: string,
        price: PlanVersionPrice | undefined,
        isFree: boolean
    ) => {
        onSelectPlan?.({
            planVersionId,
            planVersionPriceId: price?.id || null,
            billingPeriod: price?.period.code || DEFAULT_BILLING_PERIOD,
            commitmentId: price?.commitment.code || NO_COMMITMENT,
            planCode,
            planName: common(planCode as never, {fallbackToKey: true}),
            price: price ? formatPrice(price.amount, price.currency.code, price.currency.minorUnit) : "",
            isFree
        });
    }, [onSelectPlan, common]);

    /**
     * Format rule value for display
     */
    const formatRuleValue = useCallback((rule: {
        readonly isQuota: boolean;
        readonly isUnlimited: boolean;
        readonly limitValue: number | null | undefined;
    }): string => {
        if (!rule.isQuota) {
            return "✓";
        }
        if (rule.isUnlimited) {
            return common("unlimited");
        }
        return rule.limitValue?.toString() || "-";
    }, [common]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Auto-load query when ready
     */
    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef?.data) {
            queryRef?.load();
        }
    }, [queryRef?.hasPermission, queryRef?.isLoading, queryRef?.data, queryRef?.load]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={AllActiveLicensePlansQuery}
            parameters={{}}
            ref={setQueryRef}
        >
            {/* No permission */}
            {queryRef && !queryRef.hasPermission && (
                <div className="alert alert-warning">
                    {t("noPermission")}
                </div>
            )}

            {/* Plans loaded */}
            {queryRef?.data && (
                <div className="d-flex flex-column gap-4">
                    {/* Commitment selection */}
                    <SelectCommitmentRestricted
                        value={commitmentCode}
                        onChange={setCommitmentCode}
                    />

                    {/* Plans grid */}
                    {plans.length === 0 ? (
                        <div className="alert alert-info">
                            {t("noPlans")}
                        </div>
                    ) : (
                        <div className="row g-4">
                            {plans.map(plan => {
                                const version = plan.currentVersion!;
                                const isCurrentPlan = currentPlanVersionId === version.id;
                                const price = findPrice(version.prices, commitmentCode);
                                const discountPercent = findDiscountPercent(version.prices, price);

                                return (
                                    <div key={plan.id} className={columnClass}>
                                        <CardElement
                                            variant={isCurrentPlan ? "bordered" : "elevated"}
                                            padding="lg"
                                            className={`h-100${isCurrentPlan ? " border-primary" : ""}`}
                                            footer={
                                                <div className="d-grid">
                                                    {isCurrentPlan && (
                                                        <ButtonElement variant="outline-primary" disabled>
                                                            {t("currentPlan")}
                                                        </ButtonElement>
                                                    )}

                                                    {/* No payment provider configured: a paid plan cannot
                                                        be subscribed online — invite the user to get in touch */}
                                                    {!isCurrentPlan && !version.isFree && !isPaymentProviderEnabled && (
                                                        <ButtonElement variant="outline-secondary" disabled>
                                                            {t("contactUs")}
                                                        </ButtonElement>
                                                    )}

                                                    {!isCurrentPlan && (version.isFree || isPaymentProviderEnabled) && (
                                                        <ButtonElement
                                                            variant={version.isFree ? "outline-secondary" : "primary"}
                                                            onClick={() => handleSelectPlan(version.id, plan.code, price, version.isFree)}
                                                        >
                                                            {t("selectPlan")}
                                                        </ButtonElement>
                                                    )}
                                                </div>
                                            }
                                        >
                                            {/* Plan header */}
                                            <div className="text-center mb-4">
                                                <h4 className="mb-2">
                                                    {common(plan.code as never, {fallbackToKey: true})}
                                                </h4>
                                                {isCurrentPlan && (
                                                    <span className="badge bg-primary">
                                                        {t("currentPlan")}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="text-center mb-4">
                                                {version.isFree ? (
                                                    <div className="display-6 fw-bold">{t("free")}</div>
                                                ) : (
                                                    <>
                                                        <div className="display-6 fw-bold">
                                                            {price
                                                                ? formatPrice(price.amount, price.currency.code, price.currency.minorUnit)
                                                                : common("notAvailable")}
                                                        </div>
                                                        <div className="text-muted">
                                                            {price?.period.code === "MONTHLY" ? t("perMonth") : t("perYear")}
                                                        </div>
                                                        {discountPercent > 0 && (
                                                            <span className="badge bg-success mt-2">
                                                                {t("commitmentDiscount", {values: {percent: discountPercent.toString()}})}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Rules/Features */}
                                            <ul className="list-unstyled mb-0">
                                                {version.rules.map(rule => (
                                                    <li key={rule.id} className="d-flex justify-content-between py-2 border-bottom">
                                                        <span>{common(rule.rule.code as CommonTranslationKey, {fallbackToKey: true})}</span>
                                                        <span className="fw-bold">{formatRuleValue(rule)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardElement>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </LysQueryProvider>
    );
};

ListActiveLicensePlansRestricted.displayName = "ListActiveLicensePlansRestricted";

export default ListActiveLicensePlansRestricted;
