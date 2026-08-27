import React, {useCallback, useMemo} from "react";
import {RequestForgottenPasswordResetFeatureProps} from "./types";
import {useRequestForgottenPasswordResetTranslations} from "./translations";
import {useDialogWithUpdates} from "lys-front/providers";
import ButtonElement from "@/components/elements/ButtonElement";
import FormFeature from "../FormFeature";
import {validators} from "lys-front/tools";
import CardElement from "@/components/elements/CardElement";

const DIALOG_KEY = "request-forgotten-password-reset";

/**
 * Dialog body component props
 */
interface DialogBodyProps {
    onSubmit: (email: string) => void;
    isLoading: boolean;
}

/**
 * Dialog body component
 */
const DialogBody: React.FC<DialogBodyProps> = ({onSubmit, isLoading}) => {
    const {t} = useRequestForgottenPasswordResetTranslations();

    const sections = useMemo(() => [
        {
            uniqueKey: "email-section",
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
            ],
        },
    ], [t]);

    const handleSubmit = useCallback((parameters: { [key: string]: any }) => {
        const {email} = parameters;
        onSubmit(email as string);
    }, [onSubmit]);

    return (
        <CardElement
            variant="flat"
            padding="lg"
            footer={
                <p className="text-muted small">
                    {t("footer")}
                </p>
            }
        >
            <FormFeature
                uniqueKey="request-forgotten-password-reset-form"
                sections={sections}
                submit={handleSubmit}
                isInFlight={isLoading}
                initParameters={{email: ""}}
                submitButtonText={t("submit")}
            />
        </CardElement>
    );
};

/**
 * RequestForgottenPasswordResetFeature component
 *
 * Renders a link that opens an OffCanvas dialog with a password reset request form.
 * - Displays "Forgot password?" link
 * - Opens OffCanvas on the right with email form
 * - Calls onSubmit with email when form is submitted
 *
 * This is a feature component (Layer 2) that contains business logic
 * but no permission checks or direct API connections.
 */
const RequestForgottenPasswordResetFeature: React.FC<RequestForgottenPasswordResetFeatureProps> = ({
    onSubmit,
    isLoading = false
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useRequestForgottenPasswordResetTranslations();

    /**
     * Dialog with automatic updates when isLoading changes
     */
    const dialog = useDialogWithUpdates({
        uniqueKey: DIALOG_KEY,
        title: t("dialogTitle"),
        placement: "end",
        size: "md",
        body: DialogBody,
        bodyProps: {
            onSubmit,
            isLoading
        },
        deps: [isLoading]
    });

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <ButtonElement
            variant="link"
            size="sm"
            type="button"
            onClick={dialog.open}
            className="p-0"
        >
            {t("linkText")}
        </ButtonElement>
    );
};

RequestForgottenPasswordResetFeature.displayName = "RequestForgottenPasswordResetFeature";

export default RequestForgottenPasswordResetFeature;