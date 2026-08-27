import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {
    PlanVersionRule,
    SetPlanVersionRuleRestrictedProps,
    SetPlanVersionRuleRestrictedRefInterface
} from "./types";
import {useSetPlanVersionRuleRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import FormFeature from "@/components/features/FormFeature";
import {FormSection} from "@/components/features/FormFeature/types";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import {CommonTranslationKey} from "@/services/i18n/common";

/**
 * GraphQL mutation for setting a quota on a plan version
 */
const SetPlanVersionRuleMutation = graphql`
    mutation SetPlanVersionRuleRestrictedMutation($input: SetPlanVersionRuleInput!) {
        setLicensePlanVersionRule(input: $input) {
            id
            limitValue
            isUnlimited
        }
    }
`;

/**
 * Rules a version can be limited by
 *
 * Reference data of the licensing framework. No webservice lists it yet, so the
 * identifiers are restated here; they are the ids the mutation expects. Rules
 * already set on the version are added to this list, so a rule set through the
 * API is editable here too.
 */
const KNOWN_RULE_IDS = ["MAX_COMPANIES", "MAX_USERS"];

/**
 * Form field name carrying the limit of a rule
 */
const fieldName = (ruleCode: string): string => `limit_${ruleCode}`;

/**
 * Dialog content component for setting the quotas
 */
interface SetRuleDialogContentProps {
    planVersionId: string;
    rules: PlanVersionRule[];
    onUpdated?: () => void;
}

const SetRuleDialogContent: React.FC<SetRuleDialogContentProps> = ({
    planVersionId,
    rules,
    onUpdated
}) => {
    const {t, common} = useSetPlanVersionRuleRestrictedTranslations();
    const alertMessage = useAlertMessages();
    const dialog = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /**
     * Every rule the dialog offers: those already set on the version first,
     * then the known ones not set yet
     */
    const ruleCodes = useMemo(() => {
        const setCodes = rules.map(rule => rule.ruleCode);
        return [...setCodes, ...KNOWN_RULE_IDS.filter(code => !setCodes.includes(code))];
    }, [rules]);

    /**
     * Current limits, keyed by form field name
     */
    const initParameters = useMemo(() => {
        const values: Record<string, string> = {};

        for (const rule of rules) {
            values[fieldName(rule.ruleCode)] = rule.limitValue === null ? "" : String(rule.limitValue);
        }

        return values;
    }, [rules]);

    /**
     * Form sections configuration: one limit per rule
     */
    const formSections: FormSection[] = useMemo(() => [
        {
            uniqueKey: "rules",
            description: t("limitHelp"),
            controls: ruleCodes.map(ruleCode => ({
                valueKey: fieldName(ruleCode),
                label: common(ruleCode as CommonTranslationKey) || ruleCode,
                type: "number" as const,
                isFloatingLabel: true,
                xs: 12
            }))
        }
    ], [t, common, ruleCodes]);

    /**
     * Commit the quotas one after the other
     *
     * The webservice sets a single rule per call, so a change on several rules
     * is several calls. They are chained rather than fired together: a failure
     * stops the run and says which rule it stopped on, instead of leaving an
     * unknown subset applied.
     */
    const commitNext = useCallback((
        pending: {ruleId: string; limitValue: number | null}[],
        index: number
    ) => {
        if (!mutationRef?.commit) return;

        if (index >= pending.length) {
            alertMessage.merge([{
                text: t("success"),
                level: "SUCCESS"
            }]);
            dialog.close();
            onUpdated?.();
            return;
        }

        mutationRef.commit({
            variables: {
                input: {
                    planVersionId,
                    ruleId: pending[index].ruleId,
                    limitValue: pending[index].limitValue
                }
            },
            onCompleted: () => commitNext(pending, index + 1),
            onError: (error) => {
                alertMessage.merge([{
                    text: error.message || t("error"),
                    level: "ERROR"
                }]);
                // Earlier quotas of the run are applied: refresh to show them
                onUpdated?.();
            }
        });
    }, [mutationRef, planVersionId, alertMessage, t, dialog, onUpdated]);

    /**
     * Handle form submission
     *
     * An empty limit is sent as null, which is how the framework expresses an
     * unlimited quota. Unchanged limits are not sent.
     */
    const handleSubmit = useCallback((parameters: {[key: string]: any}) => {
        if (!mutationRef?.commit) return;

        const pending: {ruleId: string; limitValue: number | null}[] = [];

        for (const ruleCode of ruleCodes) {
            const rawLimit = parameters[fieldName(ruleCode)];
            const isEmpty = rawLimit === undefined || rawLimit === null || String(rawLimit).trim() === "";
            const limitValue = isEmpty ? null : parseInt(String(rawLimit), 10);

            if (limitValue !== null && (isNaN(limitValue) || limitValue < 0)) {
                alertMessage.merge([{
                    text: t("invalidLimit"),
                    level: "ERROR"
                }]);
                return;
            }

            const currentRule = rules.find(rule => rule.ruleCode === ruleCode);
            const isUnchanged = currentRule !== undefined && currentRule.limitValue === limitValue;

            // A rule not set yet and left empty stays unset
            if (isUnchanged || (currentRule === undefined && isEmpty)) {
                continue;
            }

            pending.push({ruleId: ruleCode, limitValue});
        }

        if (pending.length === 0) {
            dialog.close();
            return;
        }

        commitNext(pending, 0);
    }, [mutationRef, ruleCodes, rules, alertMessage, t, dialog, commitNext]);

    return (
        <LysMutationProvider
            mutation={SetPlanVersionRuleMutation}
            notPermissionDisplayType="show"
            ref={setMutationRef}
        >
            <CardElement
                variant="flat"
                padding="lg"
            >
                <p className="mb-3">{t("dialogMessage")}</p>

                <FormFeature
                    uniqueKey="set-plan-version-rule-form"
                    sections={formSections}
                    submit={handleSubmit}
                    isInFlight={mutationRef?.isInFlight}
                    disabled={!mutationRef?.commit}
                    submitButtonText={t("submit")}
                    initParameters={initParameters}
                    showReset={false}
                />
            </CardElement>
        </LysMutationProvider>
    );
};

/**
 * SetPlanVersionRuleRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected quota setting on a plan version
 * - Dialog pre-filled with the limits already in place
 * - setLicensePlanVersionRule mutation, one call per changed rule
 *
 * Unlike prices, quotas stay editable on a published version: they widen or
 * narrow what subscribers get without changing what they pay.
 */
const SetPlanVersionRuleRestricted = forwardRef<SetPlanVersionRuleRestrictedRefInterface, SetPlanVersionRuleRestrictedProps>(
    ({planVersionId, rules = [], display = true, onUpdated}, ref) => {
        const {t} = useSetPlanVersionRuleRestrictedTranslations();
        const {open} = useLysDialog();

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

        /**
         * Dialog unique key
         */
        const dialogKey = useMemo(() => `set-plan-version-rule-${planVersionId}`, [planVersionId]);

        /**
         * Handle opening the dialog
         */
        const handleOpen = useCallback(() => {
            open({
                uniqueKey: dialogKey,
                title: t("dialogTitle"),
                body: SetRuleDialogContent,
                bodyProps: {
                    planVersionId,
                    rules,
                    onUpdated
                },
                size: "md",
                syncWithUrl: false
            });
        }, [dialogKey, t, open, planVersionId, rules, onUpdated]);

        /**
         * Expose hasPermission and open via ref
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit,
            open: handleOpen
        }), [mutationRef?.commit, handleOpen]);

        return (
            <LysMutationProvider
                mutation={SetPlanVersionRuleMutation}
                notPermissionDisplayType="hide"
                ref={setMutationRef}
            >
                {display && mutationRef?.commit && (
                    <ButtonElement
                        variant="secondary"
                        size="sm"
                        onClick={handleOpen}
                    >
                        <i className="bi bi-sliders me-2" />
                        {t("submit")}
                    </ButtonElement>
                )}
            </LysMutationProvider>
        );
    }
);

SetPlanVersionRuleRestricted.displayName = "SetPlanVersionRuleRestricted";

export default SetPlanVersionRuleRestricted;
