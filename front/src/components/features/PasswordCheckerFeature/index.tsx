import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useIntl} from "react-intl";
import {PasswordCheckerFeatureProps, PasswordStrength} from "./types";
import {mandatoryPasswordRules, optionalPasswordRules} from "./config";
import InputElement from "@/components/elements/InputElement";
import {isEmpty} from "lys-front/tools";
import {cn} from "lys-front/tools";

/**
 * PasswordCheckerFeature component
 *
 * Feature component (Layer 2) that provides real-time password validation with:
 * - Password confirmation field
 * - Visual strength indicator
 * - Rule-by-rule validation display
 * - Mandatory and optional rules
 * - Accessibility features
 *
 * This is a Feature because it contains business logic (password validation rules).
 */
const PasswordCheckerFeature: React.FC<PasswordCheckerFeatureProps> = ({
    valueToTest,
    setIsTestPassed,
    isFloatingLabel = false,
    disabled = false,
    transPrefix = "lys.components.features.passwordCheckerFeature.",
    confirmationId = "password-checker-confirm-password",
    className = "",
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const intl = useIntl();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Calculate success counts for validation rules
     */
    const validationResults = useMemo(() => {
        const mandatoryResults = mandatoryPasswordRules.map((rule) => ({
            ...rule,
            passed: rule.regExp.test(valueToTest),
        }));

        const optionalResults = optionalPasswordRules.map((rule) => ({
            ...rule,
            passed: rule.regExp.test(valueToTest),
        }));

        const mandatoryCount = mandatoryResults.filter((r) => r.passed).length;
        const optionalCount = optionalResults.filter((r) => r.passed).length;

        const confirmationPassed = !isEmpty(passwordConfirmation) && passwordConfirmation === valueToTest;

        return {
            mandatoryResults,
            optionalResults,
            mandatoryCount,
            optionalCount,
            confirmationPassed,
        };
    }, [valueToTest, passwordConfirmation]);

    /**
     * Calculate password strength
     */
    const strength: PasswordStrength = useMemo(() => {
        const {mandatoryCount, optionalCount} = validationResults;

        if (mandatoryCount <= 1) return "veryWeak";
        if (mandatoryCount <= 3) return "weak";
        if (mandatoryCount === 4) {
            if (optionalCount === 0) return "good";
            if (optionalCount === 1) return "strong";
            return "veryStrong";
        }
        return "veryWeak";
    }, [validationResults]);

    /**
     * Calculate progress bar percentage
     */
    const successRate = useMemo(() => {
        const total = mandatoryPasswordRules.length + optionalPasswordRules.length;
        const count = validationResults.mandatoryCount + validationResults.optionalCount;
        return Math.round((count / total) * 100);
    }, [validationResults]);

    /**
     * Progress bar color class
     */
    const bgColorClassName = useMemo(() => {
        const {mandatoryCount} = validationResults;

        if (mandatoryCount <= 1) return "bg-danger";
        if (mandatoryCount <= 3) return "bg-warning";
        if (mandatoryCount === 4) return "bg-success";
        return "bg-danger";
    }, [validationResults]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Render a single validation check
     */
    const renderCheck = useCallback(
        (passed: boolean, translationKey: string, level: "error" | "warning") => {
            const iconClass = passed ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger";
            const warningClass = !passed && level === "warning" ? "text-warning" : "";

            return (
                <div
                    key={translationKey}
                    className={cn("d-flex align-items-center gap-2 mb-1", warningClass)}
                    role="listitem"
                >
                    <i className={cn("bi", iconClass)} aria-hidden="true"></i>
                    <span>
                        {intl.formatMessage({id: transPrefix + translationKey})}
                    </span>
                </div>
            );
        },
        [intl, transPrefix]
    );

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Update test passed status when validation state changes
     */
    useEffect(() => {
        const allMandatoryPassed = validationResults.mandatoryCount === mandatoryPasswordRules.length;
        const confirmationValid = validationResults.confirmationPassed;
        const isValid = allMandatoryPassed && confirmationValid;

        setIsTestPassed(isValid);
    }, [validationResults, setIsTestPassed]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <div className={cn("password-checker-feature", className)}>
            {/* Password Confirmation Field */}
            <div className="mb-3">
                <InputElement
                    id={confirmationId}
                    type="password"
                    isFloatingLabel={isFloatingLabel}
                    placeholder=""
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    disabled={disabled}
                    label={intl.formatMessage({id: transPrefix + "passwordConfirmation"})}
                    required
                />
            </div>

            {/* Progress Bar */}
            <div className="progress mb-3" role="progressbar" aria-valuenow={successRate} aria-valuemin={0} aria-valuemax={100}>
                <div
                    className={cn("progress-bar", bgColorClassName)}
                    style={{width: `${successRate}%`}}
                >
                    {intl.formatMessage({id: transPrefix + strength})}
                </div>
            </div>

            {/* Validation Checks */}
            <div role="list" aria-label={intl.formatMessage({id: transPrefix + "validationRules"})}>
                {/* Header */}
                <div className="mb-2 fw-bold">
                    {intl.formatMessage({id: transPrefix + "header"})}
                </div>

                {/* Password Confirmation Check */}
                {renderCheck(
                    validationResults.confirmationPassed,
                    "passwordConfirmationLabel",
                    "error"
                )}

                {/* Mandatory Rules */}
                {validationResults.mandatoryResults.map((result) =>
                    renderCheck(result.passed, result.key, result.level)
                )}

                {/* Optional Rules */}
                {validationResults.optionalResults.map((result) =>
                    renderCheck(result.passed, result.key, result.level)
                )}
            </div>
        </div>
    );
};

PasswordCheckerFeature.displayName = "PasswordCheckerFeature";

export default PasswordCheckerFeature;