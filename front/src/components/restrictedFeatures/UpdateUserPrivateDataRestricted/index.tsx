import {forwardRef, useCallback, useImperativeHandle, useRef, useState} from "react";
import {graphql} from "react-relay";
import {UpdateUserPrivateDataRestrictedProps, UpdateUserPrivateDataRestrictedRefInterface} from "./types";
import {useUpdateUserPrivateDataRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {useFormEditMode} from "@/hooks/useFormEditMode";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import UserPrivateDataFormFeature from "@/components/features/UserPrivateDataFormFeature";
import {UserPrivateDataFormData, UserPrivateDataFormFeatureRef} from "@/components/features/UserPrivateDataFormFeature/types";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import "./UpdateUserPrivateDataRestrictedFragment";

/**
 * UpdateUserPrivateDataRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected private data update
 * - GraphQL mutation via LysMutationProvider
 * - Success/error handling
 * - Form validation
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps UserPrivateDataFormFeature with permission logic
 * - Manages GraphQL mutation for updateUserPrivateData
 * - Provides success notifications
 */
const UpdateUserPrivateDataRestricted = forwardRef<UpdateUserPrivateDataRestrictedRefInterface, UpdateUserPrivateDataRestrictedProps>(
    ({userId, accessParameters, firstName, lastName, genderCode, languageCode, footer, onCompleted}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useUpdateUserPrivateDataRestrictedTranslations();
        const alertMessage = useAlertMessages();
        const {isEditing, disabled, startEdit, cancelEdit, submitEdit} = useFormEditMode();

        /*******************************************************************************************************************
         *                                                  REFS
         ******************************************************************************************************************/

        const formRef = useRef<UserPrivateDataFormFeatureRef>(null);

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
        const handleSubmit = useCallback((data: UserPrivateDataFormData) => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    id: userId,
                    inputs: {
                        firstName: data.firstName || null,
                        lastName: data.lastName || null,
                        genderCode: data.genderCode || null,
                        languageCode: data.languageCode || null
                    }
                },
                onCompleted: (response: any) => {
                    // Call parent's onCompleted callback if provided
                    if (onCompleted && response?.updateUserPrivateData) {
                        onCompleted(response.updateUserPrivateData);
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
        }, [mutationRef, userId, alertMessage, t, onCompleted, submitEdit]);

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
                    mutation UpdateUserPrivateDataRestrictedMutation($id: ID!, $inputs: UpdateUserPrivateDataInput!) {
                        updateUserPrivateData(id: $id, inputs: $inputs) {
                            ...UpdateUserPrivateDataRestrictedFragment_user
                        }
                    }
                `}
                accessParameters={accessParameters}
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
                        footer={footer}
                    >
                        <UserPrivateDataFormFeature
                            ref={formRef}
                            onSubmit={handleSubmit}
                            isLoading={mutationRef.isInFlight}
                            initialValues={{
                                firstName: firstName || "",
                                lastName: lastName || "",
                                genderCode: genderCode || "",
                                languageCode: languageCode || ""
                            }}
                            disabled={disabled}
                        />
                    </CardElement>
                )}
            </LysMutationProvider>
        );
    }
);

UpdateUserPrivateDataRestricted.displayName = "UpdateUserPrivateDataRestricted";

export default UpdateUserPrivateDataRestricted;
