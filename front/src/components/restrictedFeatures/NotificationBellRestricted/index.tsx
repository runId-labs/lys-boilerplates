import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {NotificationBellRestrictedProps, NotificationBellRestrictedRefInterface} from "./types";
import {useNotificationBellRestrictedTranslations} from "./translations";
import {useNotificationPanelDialog} from "./useNotificationPanelDialog";
import {useAlertMessages} from "lys-front/providers";
import {useSignalSubscription} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useDebouncedCallback} from "@/hooks/useDebouncedCallback";
import type {NotificationBellRestrictedQuery} from "./__generated__/NotificationBellRestrictedQuery.graphql";
import "./styles.scss";

/**
 * GraphQL query for fetching unread notifications count
 */
const UnreadNotificationsCountQuery = graphql`
    query NotificationBellRestrictedQuery {
        unreadNotificationsCount {
            unreadCount
        }
    }
`;

/**
 * A batch import/analysis run fires one notification per file/year as the worker
 * processes them — debounce the count refresh so a burst of signals costs one query,
 * not one per signal. Each notification still shows its own toast, undebounced (see
 * the NEW_NOTIFICATION handler below): only the count reload is coalesced.
 */
const UNREAD_COUNT_DEBOUNCE_MS = 500;

/**
 * NotificationBellRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected notification bell UI
 * - Real-time notification subscription via SignalProvider
 * - Notification count badge (shows "9+" if more than 9)
 * - Alert trigger when new notification arrives
 */
const NotificationBellRestricted = forwardRef<NotificationBellRestrictedRefInterface, NotificationBellRestrictedProps>(
    (_, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useNotificationBellRestrictedTranslations();
        const alertMessage = useAlertMessages();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<NotificationBellRestrictedQuery> | null>(null);
        const [unreadCount, setUnreadCount] = useState<number>(0);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Refresh the unread count from the query
         */
        const refreshUnreadCount = useCallback(() => {
            if (queryRef?.hasPermission) {
                queryRef.load();
            }
        }, [queryRef]);

        const {open: openNotificationPanel} = useNotificationPanelDialog(refreshUnreadCount, unreadCount);

        const debouncedRefreshUnreadCount = useDebouncedCallback(refreshUnreadCount, UNREAD_COUNT_DEBOUNCE_MS);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Load initial unread count when query is ready
         */
        useEffect(() => {
            if (queryRef?.hasPermission && !queryRef?.isLoading) {
                queryRef.load();
            }
        }, [queryRef?.hasPermission]);

        /**
         * Update local state when query data changes
         */
        useEffect(() => {
            if (queryRef?.data?.unreadNotificationsCount) {
                setUnreadCount(queryRef.data.unreadNotificationsCount.unreadCount);
            }
        }, [queryRef?.data]);

        /**
         * Format notification message based on type and data
         */
        const formatNotificationMessage = useCallback((typeId: string, data: Record<string, unknown> | undefined): string => {
            // lys-native notification types. Extend this switch with the project's
            // own notification types (and their translations below).
            switch (typeId) {
                case "LICENSE_GRANTED": {
                    const licenseName = (data?.license_name as string) || "";
                    return t("licenseGranted", {values: {licenseName}});
                }

                case "LICENSE_REVOKED": {
                    const licenseName = (data?.license_name as string) || "";
                    return t("licenseRevoked", {values: {licenseName}});
                }

                case "SUBSCRIPTION_PAYMENT_SUCCESS": {
                    const planName = (data?.plan_name as string) || "subscription";
                    return t("subscriptionPaymentSuccess", {values: {planName}});
                }

                case "SUBSCRIPTION_PAYMENT_FAILED": {
                    return t("subscriptionPaymentFailed");
                }

                case "SUBSCRIPTION_CANCELED": {
                    const effectiveDate = (data?.effective_date as string) || "";
                    return t("subscriptionCanceled", {values: {effectiveDate}});
                }

                default:
                    return t("newNotification");
            }
        }, [t]);

        /**
         * Subscribe to NEW_NOTIFICATION signals
         */
        useSignalSubscription((signal) => {
            if (signal.signal === "NEW_NOTIFICATION") {
                // Refresh unread count (debounced — see UNREAD_COUNT_DEBOUNCE_MS)
                debouncedRefreshUnreadCount();

                // Format and display notification message
                const typeId = signal.params?.type_id as string | undefined;
                const data = signal.params?.data as Record<string, unknown> | undefined;

                const message = typeId
                    ? formatNotificationMessage(typeId, data)
                    : t("newNotification");

                // Severity mapping for toast alerts — keep in sync with the switch above.
                const ERROR_TYPES = [
                    "SUBSCRIPTION_PAYMENT_FAILED",
                ];
                const WARNING_TYPES = [
                    "LICENSE_REVOKED",
                ];

                let level: "INFO" | "ERROR" | "WARNING" = "INFO";
                if (typeId && ERROR_TYPES.includes(typeId)) level = "ERROR";
                else if (typeId && WARNING_TYPES.includes(typeId)) level = "WARNING";

                alertMessage.merge([{
                    text: message,
                    level,
                }]);
            }
        }, [debouncedRefreshUnreadCount, alertMessage, t, formatNotificationMessage]);

        /**
         * Expose hasPermission via ref
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!queryRef?.hasPermission
        }), [queryRef?.hasPermission]);

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Format the badge text (show "9+" if more than 9)
         */
        const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysQueryProvider
                query={UnreadNotificationsCountQuery}
                ref={setQueryRef}
            >
                {queryRef?.hasPermission && (
                    <div className="notification-bell-restricted">
                        <button
                            type="button"
                            className="notification-bell-button"
                            aria-label={t("notifications")}
                            title={t("notifications")}
                            onClick={openNotificationPanel}
                        >
                            <i className="bi bi-bell"></i>
                            {unreadCount > 0 && (
                                <span className="notification-badge">
                                    {badgeText}
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </LysQueryProvider>
        );
    }
);

NotificationBellRestricted.displayName = "NotificationBellRestricted";

export default NotificationBellRestricted;