import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {VerifyEmailRestrictedProps, VerifyEmailRestrictedRefInterface} from "./types";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";

/**
 * VerifyEmailRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Automatic email verification on mount
 * - GraphQL mutation via LysMutationProvider
 * - Success/error callbacks for redirection
 *
 * This is a restricted feature component (Layer 3) that:
 * - Calls verifyEmail mutation automatically
 * - Triggers onSuccess or onError callbacks based on result
 * - No UI rendering (invisible component)
 */
const VerifyEmailRestricted = forwardRef<VerifyEmailRestrictedRefInterface, VerifyEmailRestrictedProps>(
    ({token, onSuccess, onError}, ref) => {
        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [executed, setExecuted] = useState(false);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Execute email verification
         */
        const executeVerification = useCallback(() => {
            if (!mutationRef?.commit || executed) return;

            setExecuted(true);

            mutationRef.commit({
                variables: {
                    inputs: {
                        token
                    }
                },
                onCompleted: (response: any) => {
                    if (response?.verifyEmail?.success) {
                        onSuccess();
                    } else {
                        onError("Email verification failed");
                    }
                },
                onError: (error: any) => {
                    const errorMessage = error?.source?.errors?.[0]?.message || "Email verification failed";
                    onError(errorMessage);
                }
            });
        }, [mutationRef, token, onSuccess, onError, executed]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Expose hasPermission via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit
        }), [mutationRef?.commit]);

        /**
         * Execute verification automatically when mutation is ready
         */
        useEffect(() => {
            if (mutationRef?.commit && !executed) {
                executeVerification();
            }
        }, [mutationRef?.commit, executed, executeVerification]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={graphql`
                    mutation VerifyEmailRestrictedMutation($inputs: VerifyEmailInput!) {
                        verifyEmail(inputs: $inputs) {
                            success
                        }
                    }
                `}
                ref={setMutationRef}
            >
                {/* No UI - invisible component */}
                {null}
            </LysMutationProvider>
        );
    }
);

VerifyEmailRestricted.displayName = "VerifyEmailRestricted";

export default VerifyEmailRestricted;
