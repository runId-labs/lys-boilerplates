import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {ResetPasswordRestrictedProps, ResetPasswordRestrictedRefInterface} from "./types";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";

/**
 * ResetPasswordRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Password reset mutation via LysMutationProvider
 * - Success/error callbacks for redirection
 *
 * This is a restricted feature component (Layer 3) that:
 * - Calls resetPassword mutation when commit() is called
 * - Triggers onSuccess or onError callbacks based on result
 * - No UI rendering (invisible component)
 */
const ResetPasswordRestricted = forwardRef<ResetPasswordRestrictedRefInterface, ResetPasswordRestrictedProps>(
    ({token, newPassword, onSuccess, onError}, ref) => {
        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [isInFlight, setIsInFlight] = useState(false);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Execute password reset
         */
        const commit = useCallback(() => {
            if (!mutationRef?.commit || isInFlight) return;

            setIsInFlight(true);

            mutationRef.commit({
                variables: {
                    inputs: {
                        token,
                        newPassword
                    }
                },
                onCompleted: (response: any) => {
                    setIsInFlight(false);
                    if (response?.resetPassword?.success) {
                        onSuccess();
                    } else {
                        onError("Password reset failed");
                    }
                },
                onError: (error: any) => {
                    setIsInFlight(false);
                    const errorMessage = error?.source?.errors?.[0]?.message || "Password reset failed";
                    onError(errorMessage);
                }
            });
        }, [mutationRef, token, newPassword, onSuccess, onError, isInFlight]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Expose commit and isInFlight via ref
         */
        useImperativeHandle(ref, () => ({
            commit,
            isInFlight
        }), [commit, isInFlight]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={graphql`
                    mutation ResetPasswordRestrictedMutation($inputs: ResetPasswordInput!) {
                        resetPassword(inputs: $inputs) {
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

ResetPasswordRestricted.displayName = "ResetPasswordRestricted";

export default ResetPasswordRestricted;