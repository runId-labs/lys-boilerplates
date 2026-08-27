import {SelectElementProps} from "@/components/elements/SelectElement/types";

/**
 * SelectGenderRestricted props
 *
 * Extends SelectElement props but excludes:
 * - options: Provided by GraphQL query
 * - label: Provided by translation system
 * - helperText: Provided by translation system
 */
export interface SelectGenderRestrictedProps extends Omit<SelectElementProps, 'options' | 'label' | 'helperText'> {
    // All other SelectElement props are inherited
}