import {SelectElementProps} from "@/components/elements/SelectElement/types";

/**
 * SelectPlanVersionPriceRestricted props
 *
 * Extends SelectElement props but excludes:
 * - options: Provided by GraphQL query
 * - label: Provided by translation system
 */
export interface SelectPlanVersionPriceRestrictedProps extends Omit<SelectElementProps, 'options' | 'label'> {
    /**
     * Plan whose prices are offered. Without it the select stays empty: a price
     * is only meaningful within the offer it belongs to.
     */
    planId: string | null;
}
