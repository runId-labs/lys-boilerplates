import React, {useEffect, useMemo} from "react";
import {useSearchParams} from "react-router-dom";
import {LoginFeatureProps} from "./types";
import FormFeature from "../FormFeature";
import SSOButtonsFeature from "../SSOButtonsFeature";
import CardElement from "@/components/elements/CardElement";
import RequestForgottenPasswordResetRestricted from "@/components/restrictedFeatures/RequestForgottenPasswordResetRestricted";
import SignUpRestricted from "@/components/restrictedFeatures/SignUpRestricted";
import {useAlertMessages} from "lys-front/providers";
import {validators} from "lys-front/tools";
import {useLoginTranslations} from "./translations";
import {errorTranslations, isErrorKey} from "lys-front/i18n";
import {useIntl} from "react-intl";

/**
 * LoginFeature component
 *
 * Encapsulates the business logic for user authentication including:
 * - Email and password state management
 * - Form validation
 * - Submit handling
 * - Card widget presentation with header
 *
 * This is a feature component (Layer 2) that contains business logic
 * but no permission checks or direct API connections.
 *
 * Uses FormFeature with floating labels for a modern UI.
 * Always displayed in a CardElement with variant="widget" and lock icon header.
 */
const LoginFeature: React.FC<LoginFeatureProps> = ({
    onSubmit,
    isLoading = false,
    className = ""
}) => {

    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useLoginTranslations();
    const [searchParams, setSearchParams] = useSearchParams();
    const alertMessages = useAlertMessages();
    const intl = useIntl();

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Handle SSO error/success from URL query params (after SSO callback redirect)
     */
    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            const locale = intl.locale as "en" | "fr";
            const message = isErrorKey(error)
                ? errorTranslations[error][locale]
                : errorTranslations.UNKNOWN_ERROR[locale];
            alertMessages.merge([{text: message, level: "ERROR"}]);
            // Clean up URL params
            searchParams.delete("error");
            setSearchParams(searchParams, {replace: true});
        }
    }, []);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Form sections configuration
     */
    const sections = useMemo(() => [
        {
            uniqueKey: "credentials",
            controls: [
                {
                    label: t("email"),
                    type: "email" as const,
                    valueKey: "email",
                    required: true,
                    isFloatingLabel: true,
                    validator: validators.email(t("emailError")),
                    xs: 12,
                },
                {
                    label: t("password"),
                    type: "password" as const,
                    valueKey: "password",
                    required: true,
                    isFloatingLabel: true,
                    validator: validators.required(t("passwordError")),
                    xs: 12,
                },
            ],
        },
    ], [t]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle form submission
     * Extracts email and password from parameters and calls the onSubmit callback
     */
    const handleSubmit = React.useCallback((parameters: { [key: string]: any }) => {
        const {email, password} = parameters;
        onSubmit(email as string, password as string);
    }, [onSubmit]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <CardElement
            variant="widget"
            className={className}
            header={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-lock-fill text-primary"></i>
                        <h5 className="mb-0">{t("title")}</h5>
                    </div>
                    <SignUpRestricted />
                </div>
            }
            footer={
                <div className="text-start">
                    <RequestForgottenPasswordResetRestricted />
                </div>
            }
        >
            <FormFeature
                uniqueKey="login-form"
                sections={sections}
                submit={handleSubmit}
                isInFlight={isLoading}
                initParameters={{email: "", password: ""}}
                submitButtonText={t("submit")}
            />
            <SSOButtonsFeature mode="login" />
        </CardElement>
    );
};

LoginFeature.displayName = "LoginFeature";

export default LoginFeature;