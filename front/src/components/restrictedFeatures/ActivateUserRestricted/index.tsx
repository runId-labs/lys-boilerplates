import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {ActivateUserRestrictedProps, ActivateUserRestrictedRefInterface} from "./types";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";

/**
 * ActivateUserRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - User activation mutation via LysMutationProvider
 * - Sets password and validates email in one operation
 * - Success/error callbacks for redirection
 *
 * This is a restricted feature component (Layer 3) that:
 * - Calls activateUser mutation when commit() is called
 * - Triggers onSuccess or onError callbacks based on result
 * - No UI rendering (invisible component)
 */
const ActivateUserRestricted = forwardRef<ActivateUserRestrictedRefInterface, ActivateUserRestrictedProps>(
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
         * Execute user activation
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
                    if (response?.activateUser?.success) {
                        onSuccess();
                    } else {
                        onError("Account activation failed");
                    }
                },
                onError: (error: any) => {
                    setIsInFlight(false);
                    const errorMessage = error?.source?.errors?.[0]?.message || "Account activation failed";
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
                    mutation ActivateUserRestrictedMutation($inputs: ActivateUserInput!) {
                        activateUser(inputs: $inputs) {
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

ActivateUserRestricted.displayName = "ActivateUserRestricted";

export default ActivateUserRestricted;