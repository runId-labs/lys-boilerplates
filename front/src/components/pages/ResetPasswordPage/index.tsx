import React, {useCallback, useMemo, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {PageProps} from "lys-front/types";
import {useAlertMessages} from "lys-front/providers";
import {useResetPasswordPageTranslations} from "./translation";
import FormFeature from "@/components/features/FormFeature";
import CardElement from "@/components/elements/CardElement";
import ResetPasswordRestricted from "@/components/restrictedFeatures/ResetPasswordRestricted";
import {ResetPasswordRestrictedRefInterface} from "@/components/restrictedFeatures/ResetPasswordRestricted/types";

/**
 * ResetPasswordPage
 *
 * Public page accessible to non-authenticated users.
 * Allows users to set a new password using the token from email.
 *
 * Flow:
 * 1. Extract token from URL (?token=xxx)
 * 2. Display form for new password and confirmation
 * 3. On submit: call ResetPasswordRestricted mutation
 * 4. On success: redirect to /login with success message
 * 5. On error: display error message
 */
const ResetPasswordPage: React.FC<PageProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const alertMessage = useAlertMessages();
    const {t} = useResetPasswordPageTranslations();

    const token = searchParams.get("token");

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [newPassword, setNewPassword] = useState("");
    const restrictedRef = useRef<ResetPasswordRestrictedRefInterface>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Form sections configuration
     */
    const sections = useMemo(() => [
        {
            uniqueKey: "password",
            controls: [
                {
                    label: t("newPassword"),
                    type: "password_edit" as const,
                    valueKey: "newPassword",
                    required: true,
                    isFloatingLabel: true,
                    xs: 12,
                },
            ],
        },
    ], [t]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle successful password reset
     */
    const handleSuccess = useCallback(() => {
        alertMessage.merge([{
            text: t("successMessage"),
            level: "SUCCESS"
        }]);
        navigate("/login");
    }, [alertMessage, navigate, t]);

    /**
     * Handle reset error
     */
    const handleError = useCallback((message: string) => {
        alertMessage.merge([{
            text: message,
            level: "CRITICAL"
        }]);
    }, [alertMessage]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback((parameters: { [key: string]: any }) => {
        const {newPassword: password} = parameters;

        // Store password and trigger mutation
        setNewPassword(password);

        // Use setTimeout to ensure state is updated before commit
        setTimeout(() => {
            restrictedRef.current?.commit();
        }, 0);
    }, []);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    // Missing token - redirect immediately
    if (!token) {
        alertMessage.merge([{
            text: t("missingToken"),
            level: "CRITICAL"
        }]);
        navigate("/login");
        return null;
    }

    return (
        <div className="reset-password-page lys-page-centered">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <CardElement
                            variant="widget"
                            header={
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-key-fill text-primary"></i>
                                    <h5 className="mb-0">{t("title")}</h5>
                                </div>
                            }
                        >
                            <FormFeature
                                uniqueKey="reset-password-form"
                                sections={sections}
                                submit={handleSubmit}
                                isInFlight={restrictedRef.current?.isInFlight ?? false}
                                initParameters={{newPassword: ""}}
                                submitButtonText={t("submit")}
                            />
                        </CardElement>
                    </div>
                </div>
            </div>

            {/* Invisible component that handles the mutation */}
            {newPassword && (
                <ResetPasswordRestricted
                    ref={restrictedRef}
                    token={token}
                    newPassword={newPassword}
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            )}
        </div>
    );
};

ResetPasswordPage.displayName = "ResetPasswordPage";

export default ResetPasswordPage;