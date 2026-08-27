import {forwardRef, useCallback, useImperativeHandle, useRef, useState} from "react";
import {graphql} from "react-relay";
import {UpdateClientUserEmailRestrictedProps, UpdateClientUserEmailRestrictedRefInterface} from "./types";
import {useUpdateClientUserEmailRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {useFormEditMode} from "@/hooks/useFormEditMode";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import UserEmailFormFeature from "@/components/features/UserEmailFormFeature";
import {UserEmailFormData, UserEmailFormFeatureRef} from "@/components/features/UserEmailFormFeature/types";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import {useIntl} from "react-intl";
import "./UpdateClientUserEmailRestrictedFragment";

/**
 * UpdateClientUserEmailRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client user email update
 * - GraphQL mutation via LysMutationProvider
 * - Success/error handling
 * - Form validation
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps UserEmailFormFeature with permission logic
 * - Manages GraphQL mutation for updateClientUserEmail
 * - Provides success notifications
 */
const UpdateClientUserEmailRestricted = forwardRef<UpdateClientUserEmailRestrictedRefInterface, UpdateClientUserEmailRestrictedProps>((
    {clientUserId, currentEmail, validatedAt, lastValidationRequestAt, footer, onCompleted},
    ref
) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useUpdateClientUserEmailRestrictedTranslations();
    const alertMessage = useAlertMessages();
    const intl = useIntl();
    const {isEditing, disabled, startEdit, cancelEdit, submitEdit} = useFormEditMode();

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    const formRef = useRef<UserEmailFormFeatureRef>(null);

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback((data: UserEmailFormData) => {
        if (!mutationRef?.commit) return;

        mutationRef.commit({
            variables: {
                id: clientUserId,
                inputs: {
                    newEmail: data.email
                }
            },
            onCompleted: (response: any) => {
                // Call parent's onCompleted callback if provided
                if (onCompleted && response?.updateClientUserEmail) {
                    onCompleted(response.updateClientUserEmail);
                }

                // Show success message
                alertMessage.merge([{
                    text: t("successMessage"),
                    level: "SUCCESS"
                }]);

                // Exit edit mode after successful submit
                submitEdit();
            }
        });
    }, [mutationRef, clientUserId, alertMessage, t, onCompleted, submitEdit]);

    /**
     * Handle cancel - reset form and exit edit mode
     */
    const handleCancel = useCallback(() => {
        formRef.current?.reset();
        cancelEdit();
    }, [cancelEdit]);

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
            mutation={graphql`
                mutation UpdateClientUserEmailRestrictedMutation($id: ID!, $inputs: UpdateClientUserEmailInput!) {
                    updateClientUserEmail(id: $id, inputs: $inputs) {
                        ...UpdateClientUserEmailRestrictedFragment_clientUser
                    }
                }
            `}
            ref={setMutationRef}
        >
            {mutationRef?.commit && (
                <CardElement
                    variant="flat"
                    padding="lg"
                    title={t("title")}
                    actions={
                        !isEditing ? (
                            <ButtonElement onClick={startEdit} size="sm" variant="primary">
                                <i className="bi bi-pencil me-2"></i>
                                {t("edit")}
                            </ButtonElement>
                        ) : (
                            <ButtonElement onClick={handleCancel} size="sm" variant="outline-secondary">
                                {t("cancel")}
                            </ButtonElement>
                        )
                    }
                    footer={
                        footer || (
                            <div>
                                {/* Validation Status */}
                                {validatedAt ? (
                                    <div className="text-success small mb-2">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        {t("validated")}: {intl.formatDate(validatedAt, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-warning small mb-2">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {t("notValidated")}
                                    </div>
                                )}

                                {/* Last Validation Request */}
                                {lastValidationRequestAt && (
                                    <div className="text-muted small mb-2">
                                        <i className="bi bi-clock me-2"></i>
                                        {t("lastRequest")}: {intl.formatDate(lastValidationRequestAt, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-muted small mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    {t("description")}
                                </p>
                            </div>
                        )
                    }
                >
                    <UserEmailFormFeature
                        ref={formRef}
                        currentEmail={currentEmail}
                        onSubmit={handleSubmit}
                        isLoading={mutationRef.isInFlight}
                        disabled={disabled}
                    />
                </CardElement>
            )}
        </LysMutationProvider>
    );
});

UpdateClientUserEmailRestricted.displayName = "UpdateClientUserEmailRestricted";

export default UpdateClientUserEmailRestricted;
