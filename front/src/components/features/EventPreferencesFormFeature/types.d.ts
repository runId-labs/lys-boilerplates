import {ConfigurableEvent, UserEventPreference} from "@/components/restrictedFeatures/UpdateUserEventPreferencesRestricted/types";

/**
 * EventPreferencesFormFeature props
 */
export interface EventPreferencesFormFeatureProps {
    /**
     * List of configurable events with their default values
     */
    configurableEvents: ConfigurableEvent[];

    /**
     * User's current preferences (overrides defaults)
     */
    userPreferences: UserEventPreference[];

    /**
     * Callback when a preference is changed
     */
    onPreferenceChange: (eventType: string, channel: string, enabled: boolean) => void;

    /**
     * Loading state (mutation in flight)
     */
    isLoading?: boolean;
}

/**
 * Effective preference value for a specific event and channel
 */
export interface EffectivePreference {
    eventType: string;
    channel: "email" | "notification";
    enabled: boolean;
    configurable: boolean;
    default: boolean;
}