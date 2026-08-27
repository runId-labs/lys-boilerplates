import React, {useCallback, useMemo, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {PageProps} from "lys-front/types";
import {useAlertMessages} from "lys-front/providers";
import {useActivatePageTranslations} from "./translation";
import FormFeature from "@/components/features/FormFeature";
import CardElement from "@/components/elements/CardElement";
import ActivateUserRestricted from "@/components/restrictedFeatures/ActivateUserRestricted";
import {ActivateUserRestrictedRefInterface} from "@/components/restrictedFeatures/ActivateUserRestricted/types";

/**
 * ActivatePage
 *
 * Public page accessible to non-authenticated users.
 * Allows invited users to set their password and activate their account.
 *
 * Flow:
 * 1. Extract token from URL (?token=xxx)
 * 2. Display form for new password (with password_edit for strength validation)
 * 3. On submit: call ActivateUserRestricted mutation
 * 4. On success: redirect to /login with success message
 * 5. On error: display error message
 */
const ActivatePage: React.FC<PageProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const alertMessage = useAlertMessages();
    const {t} = useActivatePageTranslations();

    const token = searchParams.get("token");

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [newPassword, setNewPassword] = useState("");
    const restrictedRef = useRef<ActivateUserRestrictedRefInterface>(null);

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
     * Handle successful activation
     */
    const handleSuccess = useCallback(() => {
        alertMessage.merge([{
            text: t("successMessage"),
            level: "SUCCESS"
        }]);
        navigate("/login");
    }, [alertMessage, navigate, t]);

    /**
     * Handle activation error
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
        <div className="activate-page lys-page-centered">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <CardElement
                            variant="widget"
                            header={
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-person-check-fill text-primary"></i>
                                    <h5 className="mb-0">{t("title")}</h5>
                                </div>
                            }
                        >
                            <p className="text-muted mb-4">{t("subtitle")}</p>
                            <FormFeature
                                uniqueKey="activate-form"
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
                <ActivateUserRestricted
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

ActivatePage.displayName = "ActivatePage";

export default ActivatePage;