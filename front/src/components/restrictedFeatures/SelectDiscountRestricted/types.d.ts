import {SelectElementProps} from "@/components/elements/SelectElement/types";

/**
 * SelectDiscountRestricted props
 *
 * Same surface as a select, minus the options: they come from the catalogue.
 */
export interface SelectDiscountRestrictedProps extends Omit<SelectElementProps, "options" | "label"> {
    /**
     * Label, defaults to the component's own wording
     */
    label?: string;
}
