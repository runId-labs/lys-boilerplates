import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {useIntl} from "react-intl";
import {Col, Collapse, Form, Row} from "react-bootstrap";
import {FormControlDescription, FormFeatureProps, FormFeatureRef} from "./types";
import {scrollToId} from "./utils";
import {cleanParameters, getNestedValue, setNestedValue} from "lys-front/tools";
import {cn} from "lys-front/tools";
import ButtonElement from "@/components/elements/ButtonElement";
import InputElement from "@/components/elements/InputElement";
import SelectElement from "@/components/elements/SelectElement";
import PasswordCheckerFeature from "@/components/features/PasswordCheckerFeature";
import TextareaWithAiRestricted from "@/components/restrictedFeatures/TextareaWithAiRestricted";

/**
 * FormFeature component
 *
 * Feature component (Layer 2) that provides dynamic form generation with:
 * - Multiple sections support
 * - Various control types (text, email, password, select, checkbox, switch, textarea)
 * - Nested object support via dot notation (e.g., "user.profile.email")
 * - Field validation with custom validators
 * - Error display with scroll-to-error
 * - Read-only/edit mode toggle
 * - Password strength checker
 * - Bootstrap grid layout support
 * - Accessibility features
 *
 * Improvements over arum-front FormElement:
 * - Renamed to FormFeature (correct layer classification)
 * - No direct mutation of parameters
 * - Better error handling
 * - Cleaner code organization
 * - ARIA attributes
 * - Ref interface for external control
 */
const FormFeature = React.forwardRef<FormFeatureRef, FormFeatureProps>(
    (
        {
            uniqueKey,
            sections,
            submit,
            targetId,
            isInFlight = false,
            initParameters = {},
            disabled = false,
            transPrefix = "lys.components.features.formFeature.",
            className,
            footer,
            parentElementId,
            showSectionTitles = true,
            submitButtonText,
            showReset = false,
            resetButtonText,
        },
        ref
    ) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const intl = useIntl();

        /*******************************************************************************************************************
         *                                                  REFS
         ******************************************************************************************************************/

        const sectionsRef = useRef(sections);
        const submitRef = useRef(submit);

        // Update refs when props change
        useEffect(() => {
            sectionsRef.current = sections;
        }, [sections]);

        useEffect(() => {
            submitRef.current = submit;
        }, [submit]);

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [parameters, setParameters] = useState<{ [key: string]: any }>(initParameters);
        const [errorMap, setErrorMap] = useState<{ [key: string]: string }>({});
        const [reset, setReset] = useState<boolean>(false);
        const [internalValidators, setInternalValidators] = useState<{ [key: string]: boolean }>({});

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Get value from parameters using dot notation
         */
        const getValue = useCallback(
            (valueKey: string): string | number | string[] | undefined => {
                return getNestedValue(parameters, valueKey);
            },
            [parameters]
        );

        /**
         * Handle change event for form controls
         */
        const setValue = useCallback(
            (valueKey: string, value: any) => {
                const newParameters = setNestedValue(parameters, valueKey, value);
                setParameters(newParameters);
            },
            [parameters]
        );

        /**
         * Handle form submission
         */
        const onSubmit = useCallback(
            (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                // Do nothing if already in flight
                if (isInFlight) return;

                // Validate all fields
                const newErrorMap: { [key: string]: string } = {};
                let firstErrorKey: string | null = null;

                sectionsRef.current.forEach((section) => {
                    section.controls.forEach((control) => {
                        const value = getNestedValue(parameters, control.valueKey);

                        // Check required fields
                        if (control.required) {
                            const isEmpty = value === undefined ||
                                           value === null ||
                                           value === "" ||
                                           (Array.isArray(value) && value.length === 0);

                            if (isEmpty) {
                                newErrorMap[control.valueKey] = intl.formatMessage({
                                    id: transPrefix + "required"
                                });
                                if (firstErrorKey === null) {
                                    firstErrorKey = control.valueKey;
                                }
                            }
                        }

                        // Check custom validator
                        if (control.validator && !control.validator.method(value)) {
                            newErrorMap[control.valueKey] = control.validator.errorMessage;
                            if (firstErrorKey === null) {
                                firstErrorKey = control.valueKey;
                            }
                        }

                        // Check internal validators (e.g., password checker)
                        if (Object.keys(internalValidators).includes(control.valueKey)) {
                            if (!internalValidators[control.valueKey]) {
                                // Add placeholder error message for styling
                                newErrorMap[control.valueKey] = " ";
                                if (firstErrorKey === null) {
                                    firstErrorKey = control.valueKey;
                                }
                            }
                        }
                    });
                });

                // Update error map
                setErrorMap(newErrorMap);

                // If there are errors, scroll to first error
                if (Object.keys(newErrorMap).length > 0 || Object.values(internalValidators).includes(false)) {
                    if (firstErrorKey) {
                        scrollToId(`form-${uniqueKey}-control-${firstErrorKey}`, parentElementId);
                    }
                    return;
                }

                // Submit form with cleaned parameters
                submitRef.current(cleanParameters(parameters), targetId);
            },
            [
                isInFlight,
                internalValidators,
                parameters,
                targetId,
                uniqueKey,
                parentElementId,
                intl,
                transPrefix,
            ]
        );

        /**
         * Render a single form control
         */
        const renderFormControl = useCallback(
            (control: FormControlDescription) => {
                const controlId = `form-${uniqueKey}-control-${control.valueKey}`;
                const localDisabled = !!control.disabled || isInFlight || disabled;
                const value = getValue(control.valueKey);
                const error = errorMap[control.valueKey];

                switch (control.type) {
                    case "custom":
                        if (!control.customComponent) {
                            console.error('Custom component not provided for control:', control.valueKey);
                            return null;
                        }

                        const CustomComponent = control.customComponent;
                        return (
                            <CustomComponent
                                id={controlId}
                                value={value}
                                onChange={(e: any) => {
                                    // Handle both event objects (e.target.value) and direct values
                                    const newValue = e?.target?.value !== undefined ? e.target.value : e;
                                    setValue(control.valueKey, newValue);
                                }}
                                disabled={localDisabled}
                                error={error}
                                formValues={parameters}
                                {...control.customProps}
                            />
                        );

                    case "checkbox":
                        return (
                            <Form.Check
                                id={controlId}
                                className={cn("mb-3", control.className)}
                                label={control.label + (control.required ? " *" : "")}
                                checked={!!value}
                                onChange={(e) => setValue(control.valueKey, e.target.checked)}
                                disabled={localDisabled}
                                aria-required={control.required}
                            />
                        );

                    case "switch":
                        return (
                            <Form.Check
                                type="switch"
                                id={controlId}
                                className={cn("mb-3", control.className)}
                                label={control.label + (control.required ? " *" : "")}
                                checked={!!value}
                                onChange={(e) => setValue(control.valueKey, e.target.checked)}
                                disabled={localDisabled}
                                aria-required={control.required}
                            />
                        );

                    case "select":
                        return (
                            <SelectElement
                                id={controlId}
                                label={control.label}
                                value={value as string}
                                onChange={(e) => setValue(control.valueKey, e.target.value)}
                                nullable={!!control.nullable}
                                options={control.options ?? []}
                                isFloatingLabel={control.isFloatingLabel}
                                disabled={localDisabled}
                                required={control.required}
                                error={error}
                                helperText={control.helperText}
                                className={control.className}
                            />
                        );

                    case "textarea":
                        if (control.aiImprove) {
                            return (
                                <TextareaWithAiRestricted
                                    id={controlId}
                                    label={control.label}
                                    placeholder={control.placeholder ?? ""}
                                    value={value as string}
                                    onChange={(e) => setValue(control.valueKey, e.target.value)}
                                    disabled={localDisabled}
                                    required={control.required}
                                    isFloatingLabel={control.isFloatingLabel}
                                    error={error}
                                    helperText={control.helperText}
                                    maxLength={control.maxLength}
                                    showCharacterCount={control.showCharacterCount}
                                    className={control.className}
                                    autoResize={control.autoResize}
                                    aiContext={control.aiContext}
                                    aiLanguage={control.aiLanguage}
                                />
                            );
                        }
                        return (
                            <InputElement
                                id={controlId}
                                type="text"
                                as="textarea"
                                label={control.label}
                                placeholder={control.placeholder ?? ""}
                                value={value as string}
                                onChange={(e) => setValue(control.valueKey, e.target.value)}
                                disabled={localDisabled}
                                required={control.required}
                                isFloatingLabel={control.isFloatingLabel}
                                error={error}
                                helperText={control.helperText}
                                maxLength={control.maxLength}
                                showCharacterCount={control.showCharacterCount}
                                className={control.className}
                                autoResize={control.autoResize}
                            />
                        );

                    case "password_edit":
                        return (
                            <div>
                                <div className="mb-2">
                                    <InputElement
                                        id={controlId}
                                        type="password"
                                        label={control.label}
                                        placeholder={control.placeholder ?? ""}
                                        value={value as string}
                                        onChange={(e) => setValue(control.valueKey, e.target.value)}
                                        disabled={localDisabled}
                                        required={control.required}
                                        isFloatingLabel={control.isFloatingLabel}
                                        error={error}
                                        className={control.className}
                                    />
                                </div>
                                {!localDisabled && (
                                    <PasswordCheckerFeature
                                        valueToTest={(value ?? "") as string}
                                        isFloatingLabel={control.isFloatingLabel}
                                        disabled={localDisabled}
                                        setIsTestPassed={(isPassedTest: boolean) => {
                                            if (internalValidators?.[control.valueKey] !== isPassedTest) {
                                                setInternalValidators({
                                                    ...internalValidators,
                                                    [control.valueKey]: isPassedTest,
                                                });
                                            }
                                        }}
                                        confirmationId={`${controlId}-confirmation`}
                                    />
                                )}
                            </div>
                        );

                    default:
                        return (
                            <InputElement
                                id={controlId}
                                type={control.type ?? "text"}
                                label={control.label}
                                placeholder={control.placeholder ?? ""}
                                value={value as string}
                                onChange={(e) => setValue(control.valueKey, e.target.value)}
                                disabled={localDisabled}
                                required={control.required}
                                isFloatingLabel={control.isFloatingLabel}
                                error={error}
                                helperText={control.helperText}
                                maxLength={control.maxLength}
                                showCharacterCount={control.showCharacterCount}
                                className={control.className}
                            />
                        );
                }
            },
            [uniqueKey, getValue, errorMap, isInFlight, disabled, setValue, internalValidators]
        );

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Expose ref methods using useImperativeHandle
         */
        const handleClear = useCallback(() => {
            setReset(true);
        }, []);

        const handleGetValues = useCallback(() => {
            return parameters;
        }, [parameters]);

        const handleSetValues = useCallback((values: { [key: string]: any }) => {
            setParameters(values);
        }, []);

        useImperativeHandle(ref, () => ({
            clearing: reset,
            clear: handleClear,
            getValues: handleGetValues,
            setValues: handleSetValues,
        }), [reset, handleClear, handleGetValues, handleSetValues]);

        /**
         * Handle reset
         */
        useEffect(() => {
            if (reset) {
                setParameters(initParameters);
                setErrorMap({});
                setInternalValidators({});
                setReset(false);
            }
        }, [reset, initParameters]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <Form onSubmit={onSubmit} className={cn("form-feature", className)} noValidate>
            {/* Form Sections */}
                {sections.map((section, sectionIndex) => (
                    <Row
                        key={`form-${uniqueKey}-section-${section.uniqueKey}`}
                        className={cn(sectionIndex !== sections.length - 1 ? "mb-4" : "")}
                    >
                        {/* Section Title */}
                        {showSectionTitles && sections.length > 1 && section.title && (
                            <Col xs={12} className="mb-3">
                                <h5>{section.title}</h5>
                            </Col>
                        )}

                        {/* Section Controls */}
                        {section.controls.map((control) => (
                            <Col
                                key={`form-${uniqueKey}-control-${control.valueKey}`}
                                className="mb-3"
                                xs={control.xs}
                                sm={control.sm}
                                md={control.md}
                                lg={control.lg}
                                xl={control.xl}
                                xxl={control.xxl}
                            >
                                {renderFormControl(control)}
                            </Col>
                        ))}
                    </Row>
                ))}

                {/* Footer */}
                {footer && <div className="mb-3 mt-2">{footer}</div>}

                {/* Submit and Reset Buttons - animated with Collapse */}
                <Collapse in={!disabled}>
                    <div>
                        <div className={cn("d-flex justify-content-center gap-2", !footer ? "mt-4" : "")}>
                            {showReset && (
                                <ButtonElement
                                    type="button"
                                    variant="secondary"
                                    onClick={handleClear}
                                    disabled={disabled || isInFlight}
                                >
                                    {resetButtonText ?? intl.formatMessage({id: transPrefix + "reset"})}
                                </ButtonElement>
                            )}
                            <ButtonElement type="submit" isLoading={isInFlight} disabled={disabled}>
                                {submitButtonText ?? intl.formatMessage({id: transPrefix + "submit"})}
                            </ButtonElement>
                        </div>
                    </div>
                </Collapse>
            </Form>
        );
    }
);

FormFeature.displayName = "FormFeature";

export default FormFeature;