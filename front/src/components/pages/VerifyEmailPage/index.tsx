import React, {useCallback} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {PageProps} from "lys-front/types";
import {useAlertMessages} from "lys-front/providers";
import {useConnectedUserInfo} from "lys-front/providers";
import VerifyEmailRestricted from "@/components/restrictedFeatures/VerifyEmailRestricted";
import {useVerifyEmailPageTranslations} from "./translation";

/**
 * VerifyEmailPage
 *
 * Public page accessible to both authenticated and non-authenticated users.
 * Automatically verifies email using token from URL query parameter.
 *
 * Flow:
 * 1. Extract token from URL (?token=xxx)
 * 2. Call VerifyEmailRestricted which triggers verifyEmail mutation
 * 3. On success:
 *    - If user connected: refresh ConnectedUserProvider to update validatedAt
 *    - Redirect to /home with success message
 * 4. On error: redirect to /home with error message
 *
 * UI: Displays a spinner while verification is in progress
 */
const VerifyEmailPage: React.FC<PageProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const alertMessage = useAlertMessages();
    const {user, refresh} = useConnectedUserInfo();
    const [commitRefresh] = refresh;
    const {t} = useVerifyEmailPageTranslations();

    const token = searchParams.get("token");

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle successful email verification
     */
    const handleSuccess = useCallback(() => {
        // If user is connected, refresh to update validatedAt
        if (user) {
            commitRefresh();
        }

        alertMessage.merge([{
            text: t("successMessage"),
            level: "SUCCESS"
        }]);
        navigate("/home");
    }, [alertMessage, navigate, t, user, commitRefresh]);

    /**
     * Handle verification error
     */
    const handleError = useCallback((message: string) => {
        alertMessage.merge([{
            text: message,
            level: "CRITICAL"
        }]);
        navigate("/home");
    }, [alertMessage, navigate]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    // Missing token - redirect immediately
    if (!token) {
        handleError(t("missingToken"));
        return null;
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{width: "3rem", height: "3rem"}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">{t("verifying")}</p>
            </div>

            {/* Invisible component that triggers the verification */}
            <VerifyEmailRestricted
                token={token}
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </div>
    );
};

VerifyEmailPage.displayName = "VerifyEmailPage";

export default VerifyEmailPage;
