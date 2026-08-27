import {forwardRef, useImperativeHandle, useMemo, useRef} from "react";
import {useFragment} from "react-relay";
import {SubscriptionFormFeatureProps, SubscriptionFormFeatureRef} from "./types";
import {useSubscriptionFormFeatureTranslations} from "./translations";
import {SubscriptionFormFeatureFragment} from "./SubscriptionFormFeatureFragment";
import FormFeature from "@/components/features/FormFeature";
import {FormSection, FormFeatureRef} from "@/components/features/FormFeature/types";
import {formatPrice} from "@/tools/formatTools";

/**
 * SubscriptionFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Subscription details display form
 * - Read-only fields for subscription information
 * - Organized in logical sections
 *
 * This is a feature component (Layer 2) that:
 * - Uses FormFeature for form rendering
 * - Uses useFragment to access subscription data
 * - Displays subscription data in read-only mode
 */
const SubscriptionFormFeature = forwardRef<SubscriptionFormFeatureRef, SubscriptionFormFeatureProps>(({
    subscriptionRef,
    disabled = true
}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useSubscriptionFormFeatureTranslations();
    const subscriptionData = useFragment(SubscriptionFormFeatureFragment, subscriptionRef);

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    const formRef = useRef<FormFeatureRef>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Format rule value based on its type
     */
    const formatRuleValue = (rule: {
        readonly isQuota: boolean;
        readonly isUnlimited: boolean;
        readonly limitValue: number | null | undefined;
    }): string => {
        if (!rule.isQuota) {
            return t("ruleEnabled");
        }
        if (rule.isUnlimited) {
            return t("ruleUnlimited");
        }
        return rule.limitValue?.toString() || common("notAvailable");
    };

    /**
     * Form values derived from fragment data
     */
    const formValues = useMemo(() => {
        const formattedPrice = (periodCode: string): string => {
            const price = subscriptionData.planVersion.prices.find(candidate => candidate.period.code === periodCode);

            return price
                ? formatPrice(price.amount, price.currency.code, price.currency.minorUnit)
                : common("notAvailable");
        };

        const values: Record<string, string> = {
            planCode: common(subscriptionData.planVersion.plan.code as never, { fallbackToKey: true }),
            priceMonthly: formattedPrice("MONTHLY"),
            priceYearly: formattedPrice("YEARLY"),
            hasPendingDowngrade: subscriptionData.hasPendingDowngrade ? common("yes") : common("no")
        };

        // Add rule values
        subscriptionData.planVersion.rules.forEach((rule) => {
            values[`rule_${rule.id}`] = formatRuleValue(rule);
        });

        return values;
    }, [subscriptionData, t, common]);

    /**
     * Form sections configuration
     */
    const formSections: FormSection[] = useMemo(() => {
        const sections: FormSection[] = [
            // Plan Information Section
            {
                uniqueKey: "plan-info",
                title: t("sectionPlan"),
                controls: [
                    {
                        label: t("labelPlan"),
                        type: "text" as const,
                        valueKey: "planCode",
                        isFloatingLabel: true,
                        xs: 12
                    }
                ]
            }
        ];

        // Pricing Section (only for paid subscriptions)
        if (!subscriptionData.isFree) {
            sections.push({
                uniqueKey: "pricing",
                title: t("sectionPricing"),
                controls: [
                    {
                        label: t("labelPriceMonthly"),
                        type: "text" as const,
                        valueKey: "priceMonthly",
                        isFloatingLabel: true,
                        xs: 12,
                        md: 4
                    },
                    {
                        label: t("labelPriceYearly"),
                        type: "text" as const,
                        valueKey: "priceYearly",
                        isFloatingLabel: true,
                        xs: 12,
                        md: 4
                    },
                    {
                        label: t("labelHasPendingDowngrade"),
                        type: "text" as const,
                        valueKey: "hasPendingDowngrade",
                        isFloatingLabel: true,
                        xs: 12,
                        md: 4
                    }
                ]
            });
        }

        // Rules Section (if there are rules)
        if (subscriptionData.planVersion.rules.length > 0) {
            sections.push({
                uniqueKey: "rules",
                title: t("sectionRules"),
                controls: subscriptionData.planVersion.rules.map((rule) => ({
                    label: common(rule.rule.code as never, {fallbackToKey: true}),
                    type: "text" as const,
                    valueKey: `rule_${rule.id}`,
                    isFloatingLabel: true,
                    xs: 12,
                    md: 6
                }))
            });
        }

        return sections;
    }, [t, subscriptionData.isFree, subscriptionData.planVersion.rules]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Expose reset method via ref
     */
    useImperativeHandle(ref, () => ({
        reset: () => {
            formRef.current?.clear();
        }
    }), []);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <FormFeature
            ref={formRef}
            uniqueKey="subscription-form"
            sections={formSections}
            submit={() => {}}
            targetId=""
            isInFlight={false}
            showSectionTitles
            initParameters={formValues}
            disabled={disabled}
        />
    );
});

SubscriptionFormFeature.displayName = "SubscriptionFormFeature";

export default SubscriptionFormFeature;