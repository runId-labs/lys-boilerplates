import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectNotificationSeverityRestrictedProps} from "./types";
import {useSelectNotificationSeverityRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectNotificationSeverityRestrictedQuery} from "./__generated__/SelectNotificationSeverityRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";

/**
 * GraphQL query for notification severities.
 *
 * Mirrors the SelectActionTypeRestricted pattern: query the parametric
 * entity from the backend so the dropdown stays in sync if a new severity
 * is added (no hardcoded list on the front).
 */
const SeveritiesQuery = graphql`
    query SelectNotificationSeverityRestrictedQuery {
        allNotificationSeverities {
            edges {
                node {
                    id
                    code
                }
            }
        }
    }
`;

/**
 * SelectNotificationSeverityRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected notification severity selection (single-select, nullable)
 * - GraphQL query via LysQueryProvider for severities
 * - Wraps SelectElement with severity options
 */
const SelectNotificationSeverityRestricted: React.FC<SelectNotificationSeverityRestrictedProps> = (props) => {
    const {t, common} = useSelectNotificationSeverityRestrictedTranslations();

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    const severityOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectNotificationSeverityRestrictedQuery["response"] | undefined;

        if (!data?.allNotificationSeverities?.edges) {
            return [];
        }

        return data.allNotificationSeverities.edges.map((edge) => ({
            label: common(edge.node.code as any) || edge.node.code,
            value: edge.node.code
        }));
    }, [queryRef?.data, common]);

    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
            queryRef?.load();
        }
    }, [queryRef?.hasPermission, queryRef?.load]);

    return (
        <LysQueryProvider
            query={SeveritiesQuery}
            parameters={{}}
            options={{fetchPolicy: 'store-or-network'}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={severityOptions}
                label={t("label")}
                nullable
            />
        </LysQueryProvider>
    );
};

SelectNotificationSeverityRestricted.displayName = "SelectNotificationSeverityRestricted";

export default SelectNotificationSeverityRestricted;