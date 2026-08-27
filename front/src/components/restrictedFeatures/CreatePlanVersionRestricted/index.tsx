import {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {CreatePlanVersionRestrictedProps, CreatePlanVersionRestrictedRefInterface} from "./types";
import {useCreatePlanVersionRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import FormFeature from "@/components/features/FormFeature";
import {FormSection} from "@/components/features/FormFeature/types";
import SelectLicensePlanRestricted from "@/components/restrictedFeatures/SelectLicensePlanRestricted";
import {CommonTranslationKey} from "@/services/i18n/common";

/**
 * GraphQL mutation for publishing a plan version
 */
export const CreatePlanVersionMutation = graphql`
    mutation CreatePlanVersionRestrictedMutation($input: CreatePlanVersionInput!) {
        createLicensePlanVersion(input: $input) {
            id
            version
            enabled
            rules {
                id
                limitValue
            }
        }
    }
`;

/**
 * Billing periods a version can be priced for
 *
 * Reference data of the licensing framework. No webservice lists it yet, so the
 * identifiers are restated here; they are the ids the mutation expects.
 */
const PRICE_PERIODS = ["YEARLY", "MONTHLY"] as const;

/**
 * Commitments a version can be priced for, one form field each
 */
const COMMITMENT_FIELDS = [
    {valueKey: "amountNoCommitment", commitmentId: "NO_COMMITMENT", labelKey: "labelPriceNoCommitment"},
    {valueKey: "amountOneYear", commitmentId: "ONE_YEAR", labelKey: "labelPriceOneYear"},
    {valueKey: "amountTwoYears", commitmentId: "TWO_YEARS", labelKey: "labelPriceTwoYears"},
    {valueKey: "amountThreeYears", commitmentId: "THREE_YEARS", labelKey: "labelPriceThreeYears"}
] as const;

/**
 * Quota rules a version is limited by, one form field each
 *
 * Every rule is always attached, an empty field meaning unlimited: a rule left
 * off the version is unlimited too, but silently so, and a version published
 * without its quotas becomes the sellable one right away.
 */
const RULE_FIELDS = [
    {valueKey: "limitMaxUsers", ruleId: "MAX_USERS", labelKey: "labelMaxUsers"}
] as const;

/**
 * CreatePlanVersionRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected publication of a plan version
 * - GraphQL mutation via LysMutationProvider
 * - Form for the plan, its billing period and one price per commitment
 *
 * This component renders the creation form directly. It is designed to be used
 * inside a dialog opened by the useCreatePlanVersionRestrictedAction hook.
 *
 * Prices are immutable once published: correcting one means publishing another
 * version, which is what this form does every time it is submitted.
 */
const CreatePlanVersionRestricted = forwardRef<CreatePlanVersionRestrictedRefInterface, CreatePlanVersionRestrictedProps>(
    ({onCompleted, initParameters}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t, common} = useCreatePlanVersionRestrictedTranslations();
        const alertMessage = useAlertMessages();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle form submission
         *
         * Amounts are entered in euros and sent in minor units, which is what
         * the licensing framework stores.
         */
        const handleSubmit = useCallback((data: Record<string, any>) => {
            if (!mutationRef?.commit) return;

            const prices = [];

            for (const {valueKey, commitmentId} of COMMITMENT_FIELDS) {
                const rawAmount = data[valueKey];

                if (rawAmount === undefined || rawAmount === null || String(rawAmount).trim() === "") {
                    continue;
                }

                const amount = parseFloat(String(rawAmount));

                if (isNaN(amount) || amount < 0) {
                    alertMessage.merge([{
                        text: t("invalidAmount"),
                        level: "ERROR"
                    }]);
                    return;
                }

                prices.push({
                    periodId: data.periodId,
                    commitmentId,
                    amount: Math.round(amount * 100)
                });
            }

            const rules = [];

            for (const {valueKey, ruleId} of RULE_FIELDS) {
                const rawLimit = data[valueKey];
                const isEmpty = rawLimit === undefined || rawLimit === null || String(rawLimit).trim() === "";
                const limitValue = isEmpty ? null : parseInt(String(rawLimit), 10);

                if (limitValue !== null && (isNaN(limitValue) || limitValue < 0)) {
                    alertMessage.merge([{
                        text: t("invalidLimit"),
                        level: "ERROR"
                    }]);
                    return;
                }

                rules.push({ruleId, limitValue});
            }

            mutationRef.commit({
                variables: {
                    input: {
                        planId: data.planId,
                        prices,
                        rules
                    }
                },
                onCompleted: (response: any) => {
                    alertMessage.merge([{
                        text: t("createSuccess"),
                        level: "SUCCESS"
                    }]);

                    // Call external callback (hook handles dialog close)
                    if (onCompleted && response?.createLicensePlanVersion) {
                        onCompleted(response.createLicensePlanVersion);
                    }
                },
                onError: (error) => {
                    alertMessage.merge([{
                        text: error.message || t("createError"),
                        level: "ERROR"
                    }]);
                }
            });
        }, [mutationRef, alertMessage, t, onCompleted]);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Billing period options
         */
        const periodOptions = useMemo(() => PRICE_PERIODS.map(periodId => ({
            value: periodId,
            label: common(periodId as CommonTranslationKey) || periodId
        })), [common]);

        /**
         * Form sections configuration
         */
        const formSections: FormSection[] = useMemo(() => [
            {
                uniqueKey: "plan",
                title: t("sectionPlan"),
                controls: [
                    {
                        valueKey: "planId",
                        type: "custom",
                        label: t("labelPlan"),
                        customComponent: SelectLicensePlanRestricted,
                        customProps: {
                            isFloatingLabel: true
                        },
                        required: true,
                        md: 6
                    },
                    {
                        valueKey: "periodId",
                        type: "select",
                        label: t("labelPeriod"),
                        isFloatingLabel: true,
                        options: periodOptions,
                        required: true,
                        md: 6
                    }
                ]
            },
            {
                uniqueKey: "prices",
                title: t("sectionPrices"),
                description: t("pricesHelp"),
                controls: COMMITMENT_FIELDS.map(({valueKey, labelKey}) => ({
                    valueKey,
                    type: "number" as const,
                    label: t(labelKey),
                    isFloatingLabel: true,
                    md: 6
                }))
            },
            {
                uniqueKey: "rules",
                title: t("sectionRules"),
                description: t("rulesHelp"),
                controls: RULE_FIELDS.map(({valueKey, labelKey}) => ({
                    valueKey,
                    type: "number" as const,
                    label: t(labelKey),
                    isFloatingLabel: true,
                    md: 6
                }))
            }
        ], [t, periodOptions]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Expose hasPermission via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit
        }), [mutationRef?.commit]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={CreatePlanVersionMutation}
                ref={setMutationRef}
            >
                {mutationRef?.commit && (
                    <CardElement variant="flat" padding="lg">
                        <FormFeature
                            uniqueKey="create-plan-version"
                            sections={formSections}
                            submit={handleSubmit}
                            isInFlight={mutationRef.isInFlight}
                            submitButtonText={t("submit")}
                            initParameters={{periodId: "YEARLY", ...initParameters}}
                        />
                    </CardElement>
                )}
            </LysMutationProvider>
        );
    }
);

CreatePlanVersionRestricted.displayName = "CreatePlanVersionRestricted";

export default CreatePlanVersionRestricted;
