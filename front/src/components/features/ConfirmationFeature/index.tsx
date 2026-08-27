import React from "react";
import {ConfirmationFeatureProps} from "./types";
import {useConfirmationFeatureTranslations} from "./translations";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * ConfirmationFeature component
 *
 * Feature component (Layer 2) that displays a confirmation dialog with:
 * - A message in a CardElement
 * - Confirm and Cancel buttons
 * - Loading state support
 */
const ConfirmationFeature: React.FC<ConfirmationFeatureProps> = ({
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    confirmVariant = "primary",
    isLoading = false
}) => {
    const {t} = useConfirmationFeatureTranslations();

    return (
        <CardElement variant="flat" padding="lg">
            <p className="mb-4">{message}</p>
            <div className="d-flex justify-content-center gap-2">
                <ButtonElement
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {cancelText || t("cancel")}
                </ButtonElement>
                <ButtonElement
                    variant={confirmVariant}
                    onClick={onConfirm}
                    isLoading={isLoading}
                >
                    {confirmText || t("confirm")}
                </ButtonElement>
            </div>
        </CardElement>
    );
};

ConfirmationFeature.displayName = "ConfirmationFeature";

export default ConfirmationFeature;