import {forwardRef, useCallback, useImperativeHandle, useRef, useState} from "react";
import {graphql} from "react-relay";
import {CreateSuperUserRestrictedProps, CreateSuperUserRestrictedRefInterface} from "./types";
import {useCreateSuperUserRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import UserCreationFormFeature from "@/components/features/UserCreationFormFeature";
import {UserCreationFormData, UserCreationFormFeatureRef} from "@/components/features/UserCreationFormFeature/types";
import CardElement from "@/components/elements/CardElement";

/**
 * GraphQL mutation for creating a super user
 */
export const CreateSuperUserMutation = graphql`
    mutation CreateSuperUserRestrictedMutation($inputs: CreateSuperUserInput!) {
        createSuperUser(inputs: $inputs) {
            id
            emailAddress {
                address
            }
            privateData {
                firstName
                lastName
            }
        }
    }
`;

/**
 * CreateSuperUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected super user creation
 * - GraphQL mutation via LysMutationProvider
 * - Success/error handling
 * - Form validation
 *
 * This component renders the creation form directly.
 * It is designed to be used inside a dialog/panel opened by useCreateSuperUserRestrictedAction hook.
 */
const CreateSuperUserRestricted = forwardRef<CreateSuperUserRestrictedRefInterface, CreateSuperUserRestrictedProps>(
    ({onCompleted}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useCreateSuperUserRestrictedTranslations();
        const alertMessage = useAlertMessages();

        /*******************************************************************************************************************
         *                                                  REFS
         ******************************************************************************************************************/

        const formRef = useRef<UserCreationFormFeatureRef>(null);

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
        const handleSubmit = useCallback((data: UserCreationFormData) => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    inputs: {
                        email: data.email,
                                                languageCode: data.languageCode,
                        firstName: data.firstName || null,
                        lastName: data.lastName || null,
                        genderCode: data.genderCode || null
                    }
                },
                onCompleted: (response: any) => {
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);

                    // Call external callback (hook handles dialog close)
                    if (onCompleted && response?.createSuperUser) {
                        onCompleted(response.createSuperUser);
                    }
                }
            });
        }, [mutationRef, alertMessage, t, onCompleted]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit
        }), [mutationRef?.commit]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={CreateSuperUserMutation}
                ref={setMutationRef}
            >
                {mutationRef?.commit && (
                    <CardElement variant="flat" padding="lg">
                        <UserCreationFormFeature
                            ref={formRef}
                            onSubmit={handleSubmit}
                            isLoading={mutationRef.isInFlight}
                        />
                    </CardElement>
                )}
            </LysMutationProvider>
        );
    }
);

CreateSuperUserRestricted.displayName = "CreateSuperUserRestricted";

export default CreateSuperUserRestricted;
