import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {UpdateUserEventPreferencesRestrictedProps, UpdateUserEventPreferencesRestrictedRefInterface, ConfigurableEvent, UserEventPreference} from "./types";
import {useUpdateUserEventPreferencesRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import EventPreferencesFormFeature from "@/components/features/EventPreferencesFormFeature";
import CardElement from "@/components/elements/CardElement";
import type {UpdateUserEventPreferencesRestrictedQuery} from "./__generated__/UpdateUserEventPreferencesRestrictedQuery.graphql";

/**
 * GraphQL query for configurable events and user preferences
 */
const EventPreferencesQuery = graphql`
    query UpdateUserEventPreferencesRestrictedQuery {
        configurableEvents {
            events {
                eventType
                email {
                    default
                    configurable
                }
                notification {
                    default
                    configurable
                }
            }
        }
        myEventPreferences {
            preferences {
                id
                eventType
                channel
                enabled
            }
        }
    }
`;

/**
 * UpdateUserEventPreferencesRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected event preferences management
 * - GraphQL query via LysQueryProvider (configurable events + user preferences)
 * - GraphQL mutation via LysMutationProvider (update preferences)
 * - Success/error handling
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps EventPreferencesFormFeature with permission logic
 * - Manages GraphQL query for available events and current preferences
 * - Manages GraphQL mutation for setEventPreference
 * - Provides success notifications
 */
const UpdateUserEventPreferencesRestricted = forwardRef<UpdateUserEventPreferencesRestrictedRefInterface, UpdateUserEventPreferencesRestrictedProps>(
    ({accessParameters, footer, onCompleted}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useUpdateUserEventPreferencesRestrictedTranslations();
        const alertMessage = useAlertMessages();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Extract configurable events from query data
         */
        const configurableEvents: ConfigurableEvent[] = useMemo(() => {
            const data = queryRef?.data as UpdateUserEventPreferencesRestrictedQuery["response"] | undefined;

            if (!data?.configurableEvents?.events) {
                return [];
            }

            return data.configurableEvents.events.map((event) => ({
                eventType: event.eventType,
                email: {
                    default: event.email.default,
                    configurable: event.email.configurable
                },
                notification: {
                    default: event.notification.default,
                    configurable: event.notification.configurable
                }
            }));
        }, [queryRef?.data]);

        /**
         * Extract user preferences from query data
         */
        const userPreferences: UserEventPreference[] = useMemo(() => {
            const data = queryRef?.data as UpdateUserEventPreferencesRestrictedQuery["response"] | undefined;

            if (!data?.myEventPreferences?.preferences) {
                return [];
            }

            return data.myEventPreferences.preferences.map((pref) => ({
                id: pref.id,
                eventType: pref.eventType,
                channel: pref.channel,
                enabled: pref.enabled
            }));
        }, [queryRef?.data]);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Handle preference change
         */
        const handlePreferenceChange = useCallback((eventType: string, channel: string, enabled: boolean) => {
            if (!mutationRef?.commit) return;

            mutationRef.commit({
                variables: {
                    inputs: {
                        eventType,
                        channel,
                        enabled
                    }
                },
                onCompleted: (response: any) => {
                    // Reload query to get updated preferences
                    if (queryRef?.load) {
                        queryRef.load();
                    }

                    // Call parent's onCompleted callback if provided
                    if (onCompleted && response?.setEventPreference) {
                        onCompleted(response.setEventPreference);
                    }

                    // Show success message
                    alertMessage.merge([{
                        text: t("successMessage"),
                        level: "SUCCESS"
                    }]);
                }
            });
        }, [mutationRef, queryRef, alertMessage, t, onCompleted]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Load initial data when query is ready
         */
        useEffect(() => {
            if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
                queryRef.load();
            }
        }, [queryRef?.hasPermission, queryRef?.load]);

        /**
         * Expose hasPermission via ref using useImperativeHandle
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!queryRef?.hasPermission && !!mutationRef?.commit
        }), [queryRef?.hasPermission, mutationRef?.commit]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysQueryProvider
                query={EventPreferencesQuery}
                accessParameters={accessParameters}
                ref={setQueryRef}
            >
                <LysMutationProvider
                    mutation={graphql`
                        mutation UpdateUserEventPreferencesRestrictedMutation($inputs: SetEventPreferenceInput!) {
                            setEventPreference(inputs: $inputs) {
                                id
                                eventType
                                channel
                                enabled
                            }
                        }
                    `}
                    accessParameters={accessParameters}
                    ref={setMutationRef}
                >
                    {queryRef?.hasPermission && mutationRef?.commit && (
                        <CardElement
                            variant="flat"
                            padding="lg"
                            title={t("title")}
                            footer={footer}
                        >
                            <EventPreferencesFormFeature
                                configurableEvents={configurableEvents}
                                userPreferences={userPreferences}
                                onPreferenceChange={handlePreferenceChange}
                                isLoading={mutationRef.isInFlight}
                            />
                        </CardElement>
                    )}
                </LysMutationProvider>
            </LysQueryProvider>
        );
    }
);

UpdateUserEventPreferencesRestricted.displayName = "UpdateUserEventPreferencesRestricted";

export default UpdateUserEventPreferencesRestricted;