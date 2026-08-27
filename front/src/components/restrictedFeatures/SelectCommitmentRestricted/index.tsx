import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {CommitmentOption, SelectCommitmentRestrictedProps} from "./types";
import {useSelectCommitmentRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import ButtonElement from "@/components/elements/ButtonElement";
import {CommonTranslationKey} from "@/services/i18n/common";
import type {SelectCommitmentRestrictedQuery} from "./__generated__/SelectCommitmentRestrictedQuery.graphql";

/**
 * GraphQL query for the commitments the catalogue is sold against
 *
 * Commitments are not exposed as a list of their own: they are reached through
 * the prices of the plans on sale. Deriving them from there is also what makes
 * the selection truthful, since a commitment without a price is a commitment
 * nobody can subscribe to.
 *
 * The public catalogue is queried, not the administration one: this selector
 * is shown to the client choosing a plan, who has no access to the versions
 * that are no longer on sale.
 */
const ActivePlanCommitmentsQuery = graphql`
    query SelectCommitmentRestrictedQuery {
        allActiveLicensePlans(first: 50) {
            edges {
                node {
                    id
                    currentVersion {
                        id
                        prices {
                            id
                            commitment {
                                code
                                durationMonths
                            }
                        }
                    }
                }
            }
        }
    }
`;

/**
 * SelectCommitmentRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected access to the commitments carrying at least one price
 * - Selection of the commitment the plans are then priced against
 * - Rendered as a segmented control, ordered from the shortest term
 */
const SelectCommitmentRestricted: React.FC<SelectCommitmentRestrictedProps> = ({
    value,
    onChange
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useSelectCommitmentRestrictedTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<SelectCommitmentRestrictedQuery> | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Distinct commitments found on the prices, shortest term first
     */
    const commitments = useMemo<CommitmentOption[]>(() => {
        const edges = queryRef?.data?.allActiveLicensePlans?.edges;

        if (!edges) return [];

        const byCode = new Map<string, CommitmentOption>();

        edges.forEach(edge => edge.node.currentVersion?.prices.forEach(price => {
            byCode.set(price.commitment.code, {
                code: price.commitment.code,
                durationMonths: price.commitment.durationMonths
            });
        }));

        return Array.from(byCode.values()).sort((a, b) => a.durationMonths - b.durationMonths);
    }, [queryRef?.data]);

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

    /**
     * Settle on the shortest term until the client picks one, so the plans are
     * never displayed without a price
     */
    useEffect(() => {
        if (!value && commitments.length > 0) {
            onChange(commitments[0].code);
        }
    }, [value, commitments, onChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={ActivePlanCommitmentsQuery}
            parameters={{}}
            ref={setQueryRef}
        >
            {commitments.length > 1 && (
                <div className="d-flex flex-column align-items-center gap-2">
                    <span className="text-muted small">{t("label")}</span>
                    <div className="btn-group" role="group" aria-label={t("label")}>
                        {commitments.map(commitment => (
                            <ButtonElement
                                key={commitment.code}
                                variant={commitment.code === value ? "primary" : "outline-primary"}
                                size="sm"
                                aria-pressed={commitment.code === value}
                                onClick={() => onChange(commitment.code)}
                            >
                                {common(commitment.code as CommonTranslationKey, {fallbackToKey: true})}
                            </ButtonElement>
                        ))}
                    </div>
                </div>
            )}
        </LysQueryProvider>
    );
};

SelectCommitmentRestricted.displayName = "SelectCommitmentRestricted";

export default SelectCommitmentRestricted;
