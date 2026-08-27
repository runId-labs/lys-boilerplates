import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectPlanVersionPriceRestrictedProps} from "./types";
import {useSelectPlanVersionPriceRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectPlanVersionPriceRestrictedQuery} from "./__generated__/SelectPlanVersionPriceRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";
import {CommonTranslationKey} from "@/services/i18n/common";
import {formatPrice} from "@/tools/formatTools";

/**
 * GraphQL query for the prices of a plan
 *
 * Only the version on sale is queried: a retired version keeps its subscribers
 * but is not something a client can be placed on.
 */
const PlanVersionPricesQuery = graphql`
    query SelectPlanVersionPriceRestrictedQuery($planId: String) {
        allLicensePlanVersions(planId: $planId, enabled: true, first: 10) {
            edges {
                node {
                    id
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
                        }
                    }
                }
            }
        }
    }
`;

/**
 * SelectPlanVersionPriceRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected price selection within a plan
 * - GraphQL query via LysQueryProvider, reloaded when the plan changes
 * - Wraps SelectElement with one option per price
 *
 * The value is the price ID, which carries the plan version, the periodicity,
 * the currency and the commitment — everything a subscription needs.
 */
const SelectPlanVersionPriceRestricted: React.FC<SelectPlanVersionPriceRestrictedProps> = ({planId, ...props}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useSelectPlanVersionPriceRestrictedTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Transform GraphQL data to SelectOption format
     *
     * Prices of every returned version are flattened: the operator picks a
     * price directly rather than a version then a commitment.
     */
    const priceOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectPlanVersionPriceRestrictedQuery["response"] | undefined;

        if (!planId || !data?.allLicensePlanVersions?.edges) {
            return [];
        }

        return data.allLicensePlanVersions.edges.flatMap(edge => edge.node.prices.map(price => ({
            label: [
                formatPrice(price.amount, price.currency.code, price.currency.minorUnit),
                common(price.period.code as CommonTranslationKey) || price.period.code,
                common(price.commitment.code as CommonTranslationKey) || price.commitment.code
            ].join(" · "),
            value: price.id
        })));
    }, [queryRef?.data, planId, common]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Load the prices of the selected plan, and reload them when it changes
     */
    useEffect(() => {
        if (planId && queryRef?.hasPermission && !queryRef?.isLoading) {
            queryRef?.load();
        }
    }, [planId, queryRef?.hasPermission, queryRef?.load]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={PlanVersionPricesQuery}
            parameters={{planId}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={priceOptions}
                label={t("label")}
                disabled={props.disabled || !planId}
            />
        </LysQueryProvider>
    );
};

SelectPlanVersionPriceRestricted.displayName = "SelectPlanVersionPriceRestricted";

export default SelectPlanVersionPriceRestricted;
