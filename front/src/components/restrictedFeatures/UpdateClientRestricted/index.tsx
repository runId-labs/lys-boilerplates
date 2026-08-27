import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {Form} from "react-bootstrap";
import {UpdateClientRestrictedProps, UpdateClientRestrictedRefInterface} from "./types";
import {useUpdateClientRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {useFormEditMode} from "@/hooks/useFormEditMode";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";
import InputElement from "@/components/elements/InputElement";

/**
 * GraphQL mutation for updating a client
 */
export const UpdateClientMutation = graphql`
    mutation UpdateClientRestrictedMutation($id: ID!, $inputs: UpdateClientInput!) {
        updateClient(id: $id, inputs: $inputs) {
            id
            name
            updatedAt
        }
    }
`;

/**
 * UpdateClientRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client update
 * - GraphQL mutation via LysMutationProvider
 * - Simple form for editing client name
 * - Edit mode pattern with read-only state
 */
const UpdateClientRestricted = forwardRef<UpdateClientRestrictedRefInterface, UpdateClientRestrictedProps>(
    ({clientId, currentName, footer, onCompleted}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useUpdateClientRestrictedTranslations();
        const alertMessage = useAlertMessages();
        const {isEditing, disabled, startEdit, cancelEdit, submitEdit} = useFormEditMode();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [name, setName] = useState(currentName);
        const [error, setError] = useState<string | null>(null);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle form submission
         */
        const handleSubmit = useCallback((e: React.FormEvent) => {
            e.preventDefault();

            // Validate
            if (!name.trim()) {
                setError(t("nameRequired"));
                return;
            }

            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    id: clientId,
                    inputs: {
                        name: name.trim()
                    }
                },
                onCompleted: (response: any) => {
                    // Call parent's onCompleted callback if provided
                    if (onCompleted && response?.updateClient) {
                        onCompleted(response.updateClient);
                    }

                    // Show success message
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);

                    // Clear error and exit edit mode
                    setError(null);
                    submitEdit();
                }
            });
        }, [mutationRef, clientId, name, alertMessage, t, onCompleted, submitEdit]);

        /**
         * Handle cancel - reset form and exit edit mode
         */
        const handleCancel = useCallback(() => {
            setName(currentName);
            setError(null);
            cancelEdit();
        }, [currentName, cancelEdit]);

        /**
         * Handle name change
         */
        const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
            if (error) setError(null);
        }, [error]);

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
                mutation={UpdateClientMutation}
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
                        <Form onSubmit={handleSubmit}>
                            <InputElement
                                id="client-name"
                                label={t("labelName")}
                                value={name}
                                onChange={handleNameChange}
                                disabled={disabled}
                                error={error || undefined}
                                isFloatingLabel
                            />

                            {isEditing && (
                                <div className="d-flex justify-content-end mt-3">
                                    <ButtonElement
                                        type="submit"
                                        variant="primary"
                                        isLoading={mutationRef.isInFlight}
                                    >
                                        {t("save")}
                                    </ButtonElement>
                                </div>
                            )}
                        </Form>
                    </CardElement>
                )}
            </LysMutationProvider>
        );
    }
);

UpdateClientRestricted.displayName = "UpdateClientRestricted";

export default UpdateClientRestricted;