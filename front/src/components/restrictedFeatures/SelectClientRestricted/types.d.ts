import {SelectElementProps} from "@/components/elements/SelectElement/types";

/**
 * SelectClientRestricted props
 *
 * Extends SelectElement props but excludes:
 * - options: Provided by GraphQL query
 * - label: Provided by translation system
 */
export interface SelectClientRestrictedProps extends Omit<SelectElementProps, 'options' | 'label'> {
    // All other SelectElement props are inherited
}