import {SelectElementProps} from "@/components/elements/SelectElement/types";

/**
 * SelectLicensePlanRestricted props
 *
 * Extends SelectElement props but excludes:
 * - options: Provided by GraphQL query
 * - label: Provided by translation system
 */
export interface SelectLicensePlanRestrictedProps extends Omit<SelectElementProps, 'options' | 'label'> {
    // All other SelectElement props are inherited
}
