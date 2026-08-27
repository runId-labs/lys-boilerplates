import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectDiscountRestrictedProps} from "./types";
import {useSelectDiscountRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectDiscountRestrictedQuery} from "./__generated__/SelectDiscountRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";
import {CommonTranslationKey} from "@/services/i18n/common";

/**
 * GraphQL query for the discounts that can be claimed when subscribing
 *
 * Only claimable discounts are listed: a discount applying on its own is not a
 * choice, and offering it as one would suggest it can be declined.
 */
const ClaimableDiscountsQuery = graphql`
    query SelectDiscountRestrictedQuery {
        allClaimableLicenseDiscounts(first: 20) {
            edges {
                node {
                    id
                    code
                    value
                    unit {
                        code
                    }
                }
            }
        }
    }
`;

/**
 * Percentage unit code, the only one the catalogue expresses values in today
 */
const PERCENT_UNIT = "PERCENT";

/**
 * SelectDiscountRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected access to the discounts that can be claimed
 * - Selection of one of them, or of none — a subscription carries at most one
 *
 * The value is the discount code, which is what the subscription mutations
 * expect.
 */
const SelectDiscountRestricted: React.FC<SelectDiscountRestrictedProps> = ({label, ...props}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useSelectDiscountRestrictedTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<SelectDiscountRestrictedQuery> | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Discounts on offer, preceded by the option of granting none
     */
    const discountOptions: SelectOption[] = useMemo(() => {
        const edges = queryRef?.data?.allClaimableLicenseDiscounts?.edges;

        const options: SelectOption[] = [{label: t("none"), value: ""}];

        if (!edges) return options;

        return options.concat(edges.map(edge => ({
            label: [
                common(edge.node.code as CommonTranslationKey, {fallbackToKey: true}),
                edge.node.unit.code === PERCENT_UNIT ? `-${edge.node.value} %` : `-${edge.node.value}`
            ].join(" · "),
            value: edge.node.code
        })));
    }, [queryRef?.data, t, common]);

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
            query={ClaimableDiscountsQuery}
            parameters={{}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={discountOptions}
                label={label || t("label")}
            />
        </LysQueryProvider>
    );
};

SelectDiscountRestricted.displayName = "SelectDiscountRestricted";

export default SelectDiscountRestricted;
