import {SelectElementProps} from "@/components/elements/SelectElement/types";

/**
 * SelectNotificationSeverityRestricted props
 *
 * Extends SelectElement props but excludes:
 * - options: Provided by GraphQL query
 * - label: Provided by translation system
 *
 * Single-select, nullable (an empty selection means "all severities").
 */
export interface SelectNotificationSeverityRestrictedProps extends Omit<SelectElementProps, 'options' | 'label'> {
    // All other SelectElement props are inherited
}