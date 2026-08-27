import React, {useCallback, useMemo} from "react";
import {EventPreferencesFormFeatureProps, EffectivePreference} from "./types";
import {useEventPreferencesFormFeatureTranslations} from "./translations";
import {Form, Table, OverlayTrigger, Tooltip} from "react-bootstrap";
import "./styles.scss";

/**
 * Category ordering and prefix mapping for event types.
 * Events are grouped by matching their prefix. Unknown events fall into "other".
 * Extend with the project's own event prefixes as needed.
 */
const CATEGORY_ORDER = ["account", "license", "subscription", "other"] as const;

const EVENT_PREFIX_TO_CATEGORY: Record<string, typeof CATEGORY_ORDER[number]> = {
    "USER_": "account",
    "LICENSE_": "license",
    "SUBSCRIPTION_": "subscription",
};

const CATEGORY_TRANSLATION_KEYS: Record<typeof CATEGORY_ORDER[number], string> = {
    account: "categoryAccount",
    license: "categoryLicense",
    subscription: "categorySubscription",
    other: "categoryOther",
};

/**
 * EventPreferencesFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Display of configurable events with email/notification toggles
 * - Calculated effective preferences (user overrides or defaults)
 * - Toggle switches for enabling/disabling notifications
 * - Disabled state for non-configurable channels
 * - Events grouped by category (account, license, subscription, finance, actions, other)
 *
 * This is a feature component (Layer 2) that:
 * - Receives data as props (no GraphQL)
 * - Handles UI rendering and user interactions
 * - Calculates effective values (user preference overrides default)
 * - Uses Bootstrap Form.Check for toggle switches
 */
const EventPreferencesFormFeature: React.FC<EventPreferencesFormFeatureProps> = ({
    configurableEvents,
    userPreferences,
    onPreferenceChange,
    isLoading = false
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useEventPreferencesFormFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Calculate effective preferences for all events and channels
     * User preferences override default values
     */
    const effectivePreferences: EffectivePreference[] = useMemo(() => {
        const preferences: EffectivePreference[] = [];

        for (const event of configurableEvents) {
            // Email channel
            const emailPref = userPreferences.find(
                (p) => p.eventType === event.eventType && p.channel === "email"
            );
            preferences.push({
                eventType: event.eventType,
                channel: "email",
                enabled: emailPref ? emailPref.enabled : event.email.default,
                configurable: event.email.configurable,
                default: event.email.default
            });

            // Notification channel
            const notificationPref = userPreferences.find(
                (p) => p.eventType === event.eventType && p.channel === "notification"
            );
            preferences.push({
                eventType: event.eventType,
                channel: "notification",
                enabled: notificationPref ? notificationPref.enabled : event.notification.default,
                configurable: event.notification.configurable,
                default: event.notification.default
            });
        }

        return preferences;
    }, [configurableEvents, userPreferences]);

    /**
     * Get unique event types to display as rows
     */
    const eventTypes = useMemo(() => {
        return [...new Set(effectivePreferences.map((p) => p.eventType))];
    }, [effectivePreferences]);

    /**
     * Group event types by category
     */
    const groupedEventTypes = useMemo(() => {
        const groups: Record<string, string[]> = {};

        for (const eventType of eventTypes) {
            let category = "other";
            for (const [prefix, cat] of Object.entries(EVENT_PREFIX_TO_CATEGORY)) {
                if (eventType.startsWith(prefix)) {
                    category = cat;
                    break;
                }
            }
            if (!groups[category]) groups[category] = [];
            groups[category].push(eventType);
        }

        return CATEGORY_ORDER
            .filter((cat) => groups[cat]?.length > 0)
            .map((cat) => ({category: cat, eventTypes: groups[cat]}));
    }, [eventTypes]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle toggle change
     */
    const handleToggle = useCallback((eventType: string, channel: "email" | "notification", currentValue: boolean) => {
        if (isLoading) return;
        onPreferenceChange(eventType, channel, !currentValue);
    }, [onPreferenceChange, isLoading]);

    /**
     * Get preference for specific event and channel
     */
    const getPreference = useCallback((eventType: string, channel: "email" | "notification") => {
        return effectivePreferences.find((p) => p.eventType === eventType && p.channel === channel);
    }, [effectivePreferences]);

    /**
     * Get translated event type label
     */
    const getEventTypeLabel = useCallback((eventType: string) => {
        // Try to get translation, fallback to event type key
        return t(eventType as any) || eventType;
    }, [t]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (eventTypes.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                {t("noConfigurableEvents")}
            </div>
        );
    }

    return (
        <div className="event-preferences-form-feature">
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>{t("eventTypeLabel")}</th>
                        <th className="text-center">
                            <i className="bi bi-envelope me-2"></i>
                            {t("email")}
                        </th>
                        <th className="text-center">
                            <i className="bi bi-bell me-2"></i>
                            {t("notification")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groupedEventTypes.map((group) => (
                        <React.Fragment key={group.category}>
                            <tr className="category-header">
                                <td colSpan={3}>
                                    {t(CATEGORY_TRANSLATION_KEYS[group.category] as any)}
                                </td>
                            </tr>
                            {group.eventTypes.map((eventType) => {
                                const emailPref = getPreference(eventType, "email");
                                const notificationPref = getPreference(eventType, "notification");

                                return (
                                    <tr key={eventType}>
                                        <td className="align-middle">
                                            <strong>{getEventTypeLabel(eventType)}</strong>
                                        </td>
                                        <td className="text-center align-middle">
                                            {emailPref && (
                                                emailPref.configurable ? (
                                                    <Form.Check
                                                        type="switch"
                                                        id={`${eventType}-email`}
                                                        checked={emailPref.enabled}
                                                        onChange={() => handleToggle(eventType, "email", emailPref.enabled)}
                                                        disabled={isLoading}
                                                        className="d-inline-block"
                                                    />
                                                ) : (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`${eventType}-email-tooltip`}>
                                                                {t("blockedTooltip")}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span>
                                                            <Form.Check
                                                                type="switch"
                                                                id={`${eventType}-email-disabled`}
                                                                checked={emailPref.enabled}
                                                                disabled
                                                                className="d-inline-block"
                                                            />
                                                        </span>
                                                    </OverlayTrigger>
                                                )
                                            )}
                                        </td>
                                        <td className="text-center align-middle">
                                            {notificationPref && (
                                                notificationPref.configurable ? (
                                                    <Form.Check
                                                        type="switch"
                                                        id={`${eventType}-notification`}
                                                        checked={notificationPref.enabled}
                                                        onChange={() => handleToggle(eventType, "notification", notificationPref.enabled)}
                                                        disabled={isLoading}
                                                        className="d-inline-block"
                                                    />
                                                ) : (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`${eventType}-notification-tooltip`}>
                                                                {t("blockedTooltip")}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span>
                                                            <Form.Check
                                                                type="switch"
                                                                id={`${eventType}-notification-disabled`}
                                                                checked={notificationPref.enabled}
                                                                disabled
                                                                className="d-inline-block"
                                                            />
                                                        </span>
                                                    </OverlayTrigger>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

EventPreferencesFormFeature.displayName = "EventPreferencesFormFeature";

export default EventPreferencesFormFeature;