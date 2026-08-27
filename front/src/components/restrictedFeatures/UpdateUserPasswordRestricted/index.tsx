import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {UpdateUserPasswordRestrictedProps, UpdateUserPasswordRestrictedRefInterface} from "./types";
import {useUpdateUserPasswordRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import UserPasswordFormFeature from "@/components/features/UserPasswordFormFeature";
import {UserPasswordFormData} from "@/components/features/UserPasswordFormFeature/types";
import CardElement from "@/components/elements/CardElement";

/**
 * UpdateUserPasswordRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected password update
 * - GraphQL mutation via LysMutationProvider
 * - Success/error handling
 * - Form validation
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps UserPasswordFormFeature with permission logic
 * - Manages GraphQL mutation for updatePassword
 * - Provides success notifications
 */
const UpdateUserPasswordRestricted = forwardRef<UpdateUserPasswordRestrictedRefInterface, UpdateUserPasswordRestrictedProps>(
    ({userId, accessParameters}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useUpdateUserPasswordRestrictedTranslations();
        const alertMessage = useAlertMessages();

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
        const handleSubmit = useCallback((data: UserPasswordFormData) => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    id: userId,
                    inputs: {
                        currentPassword: data.currentPassword,
                        newPassword: data.newPassword
                    }
                },
                onCompleted: () => {
                    // Show success message
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);
                }
            });
        }, [mutationRef, userId, alertMessage, t]);

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
                    mutation UpdateUserPasswordRestrictedMutation($id: ID!, $inputs: UpdatePasswordInput!) {
                        updatePassword(id: $id, inputs: $inputs) {
                            id
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
                        header={
                            <h6 className="mb-0">{t("title")}</h6>
                        }
                        footer={
                            <p className="text-muted small mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                {t("description")}
                            </p>
                        }
                    >
                        <UserPasswordFormFeature
                            onSubmit={handleSubmit}
                            isLoading={mutationRef.isInFlight}
                        />
                    </CardElement>
                )}
            </LysMutationProvider>
        );
    }
);

UpdateUserPasswordRestricted.displayName = "UpdateUserPasswordRestricted";

export default UpdateUserPasswordRestricted;