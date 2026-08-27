import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {graphql} from "react-relay";
import {useIntl} from "react-intl";
import {LysQueryProvider, LysQueryRefInterface, LysMutationProvider, LysMutationRefInterface, useConnectedUserInfo} from "lys-front/providers";
import {useNotificationListFeatureTranslations} from "./translations";
import {NotificationListFeatureProps} from "./types";
import type {NotificationListFeatureQuery} from "./__generated__/NotificationListFeatureQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import SelectNotificationSeverityRestricted from "@/components/restrictedFeatures/SelectNotificationSeverityRestricted";
import "./styles.scss";

const PAGE_SIZE = 10;

/**
 * GraphQL query for paginated notifications.
 *
 * Supports two filters (kept local to the panel — see ClickUp 869d2rg63):
 * - `isRead`: when false, return only unread notifications. When null, no filter.
 * - `severityId`: when set, restrict to notifications whose type carries this
 *   severity code (e.g. "ERROR"). Null → all severities.
 */
const NotificationsQuery = graphql`
    query NotificationListFeatureQuery(
        $first: Int
        $after: String
        $isRead: Boolean
        $severityId: String
    ) {
        allNotifications(
            first: $first
            after: $after
            isRead: $isRead
            severityId: $severityId
            orderBy: {createdAt: false}
        ) {
            edges {
                node {
                    id
                    createdAt
                    isRead
                    batch {
                        id
                        data
                        type {
                            code
                            severityId
                        }
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

/**
 * GraphQL mutation for marking notifications as read
 */
const MarkReadMutation = graphql`
    mutation NotificationListFeatureMarkReadMutation($ids: [ID!]!) {
        markNotificationsAsRead(ids: $ids) {
            unreadCount
        }
    }
`;

/**
 * GraphQL mutation for marking ALL of the user's unread notifications as read.
 * Clears every unread notification server-side, independently of pagination.
 */
const MarkAllReadMutation = graphql`
    mutation NotificationListFeatureMarkAllReadMutation {
        markAllNotificationsAsRead {
            unreadCount
        }
    }
`;

interface NotificationItem {
    id: string;
    createdAt: string;
    isRead: boolean;
    typeId: string;
    severityId: string;
    data: Record<string, unknown> | null;
}

/**
 * Map a notification severity id to a Bootstrap icon + colour class.
 * Drives the inline icon shown in front of each notification message.
 */
const SEVERITY_ICONS: Record<string, {icon: string; colorClass: string}> = {
    INFO: {icon: "bi-info-circle-fill", colorClass: "text-info"},
    SUCCESS: {icon: "bi-check-circle-fill", colorClass: "text-success"},
    WARNING: {icon: "bi-exclamation-triangle-fill", colorClass: "text-warning"},
    ERROR: {icon: "bi-x-circle-fill", colorClass: "text-danger"},
};

const DEFAULT_SEVERITY_ICON = SEVERITY_ICONS.INFO;

/**
 * Format notification message based on type
 */
const useFormatMessage = () => {
    const {t} = useNotificationListFeatureTranslations();

    return useCallback((typeId: string, data: Record<string, unknown> | null): string => {
        switch (typeId) {
            // lys-native notification types. Extend this switch with the project's
            // own notification types (and their translations below).
            case "LICENSE_GRANTED":
                return t("licenseGranted", {values: {licenseName: (data?.license_name as string) || ""}});
            case "LICENSE_REVOKED":
                return t("licenseRevoked", {values: {licenseName: (data?.license_name as string) || ""}});
            case "SUBSCRIPTION_PAYMENT_SUCCESS":
                return t("subscriptionPaymentSuccess", {values: {planName: (data?.plan_name as string) || "subscription"}});
            case "SUBSCRIPTION_PAYMENT_FAILED":
                return t("subscriptionPaymentFailed");
            case "SUBSCRIPTION_CANCELED":
                return t("subscriptionCanceled", {values: {effectiveDate: (data?.effective_date as string) || ""}});
            default:
                return t("unknownNotification");
        }
    }, [t]);
};

/**
 * NotificationListFeature component
 *
 * Displays a paginated list of notifications with:
 * - Unread indicator (blue dot)
 * - Mark as read on click
 * - Load more pagination
 * - Relative time display
 */
const NotificationListFeature: React.FC<NotificationListFeatureProps> = ({onMarkAsRead, unreadCount = 0}) => {
    const {t} = useNotificationListFeatureTranslations();
    const intl = useIntl();
    const formatMessage = useFormatMessage();
    const {user} = useConnectedUserInfo();

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<NotificationListFeatureQuery> | null>(null);
    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
    const [markAllRef, setMarkAllRef] = useState<LysMutationRefInterface | null>(null);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [endCursor, setEndCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentCursor, setCurrentCursor] = useState<string | null>(null);

    // Local filter state — not persisted to URL (panel is ephemeral, see ClickUp 869d2rg63).
    // `readStatus`: "" (all), "true" (read only), "false" (unread only). Default
    // "false" matches the unread badge mental model. `severityId`: empty string =
    // all severities. Both are stored as strings to match what `SelectElement`
    // produces via `e.target.value` (HTML <select> never returns null/booleans).
    const [readStatus, setReadStatus] = useState<"" | "true" | "false">("false");
    const [severityId, setSeverityId] = useState<string>("");

    const queryParameters = useMemo(() => ({
        first: PAGE_SIZE,
        after: currentCursor,
        isRead: readStatus === "" ? null : readStatus === "true",
        severityId: severityId === "" ? null : severityId,
    }), [currentCursor, readStatus, severityId]);

    /**
     * Parse query response into items
     */
    useEffect(() => {
        if (!queryRef?.data?.allNotifications) return;
        const response = queryRef.data.allNotifications;
        const newItems: NotificationItem[] = response.edges.map((edge) => ({
            id: edge.node.id,
            createdAt: edge.node.createdAt,
            isRead: edge.node.isRead,
            typeId: edge.node.batch.type.code,
            severityId: edge.node.batch.type.severityId,
            data: edge.node.batch.data as Record<string, unknown> | null,
        }));

        if (isLoadingMore) {
            setItems(prev => [...prev, ...newItems]);
            setIsLoadingMore(false);
        } else {
            setItems(newItems);
        }

        setEndCursor(response.pageInfo.endCursor ?? null);
        setHasNextPage(response.pageInfo.hasNextPage);
    }, [queryRef?.data]);

    /**
     * Initial load
     */
    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
            queryRef.load();
        }
    }, [queryRef?.hasPermission]);

    /**
     * Reload when cursor changes (pagination)
     */
    useEffect(() => {
        if (currentCursor && queryRef?.hasPermission) {
            queryRef.load();
        }
    }, [currentCursor]);

    /**
     * Reset cursor + items + reload when filters change.
     * Items from the previous filter set don't match the new filter and
     * the cursor is offset-based, so it would be invalid against a different
     * result set.
     */
    useEffect(() => {
        if (!queryRef?.hasPermission) return;
        setItems([]);
        setEndCursor(null);
        setHasNextPage(false);
        setCurrentCursor(null);
        queryRef.load();
    }, [readStatus, severityId]);

    /**
     * Load more notifications
     */
    const handleLoadMore = useCallback(() => {
        if (!endCursor || isLoadingMore) return;
        setIsLoadingMore(true);
        setCurrentCursor(endCursor);
    }, [endCursor, isLoadingMore]);

    /**
     * Mark a notification as read
     */
    const handleMarkAsRead = useCallback((notificationId: string) => {
        if (!mutationRef?.commit) return;

        mutationRef.commit({
            variables: {ids: [notificationId]},
            onCompleted: () => {
                setItems(prev => prev.map(item =>
                    item.id === notificationId ? {...item, isRead: true} : item
                ));
                onMarkAsRead?.([notificationId]);
            }
        });
    }, [mutationRef, onMarkAsRead]);

    /**
     * Mark every unread notification as read (server-side, all pages).
     */
    const handleMarkAllAsRead = useCallback(() => {
        if (!markAllRef?.commit || isMarkingAll) return;
        setIsMarkingAll(true);
        markAllRef.commit({
            variables: {},
            onCompleted: () => {
                setItems(prev => prev.map(item => ({...item, isRead: true})));
                setIsMarkingAll(false);
                // Refresh the bell badge (drives this button's disabled state back to true).
                onMarkAsRead?.([]);
            },
            onError: () => setIsMarkingAll(false),
        });
    }, [markAllRef, isMarkingAll, onMarkAsRead]);

    /**
     * Format relative time
     */
    const formatTime = useCallback((dateString: string) => {
        return intl.formatDate(dateString, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }, [intl]);

    return (
        <LysQueryProvider
            query={NotificationsQuery}
            parameters={queryParameters}
            accessParameters={{ownerIds: [user?.id || ""]}}
            options={{fetchPolicy: "network-only"}}
            ref={setQueryRef}
        >
            <LysMutationProvider
                mutation={MarkReadMutation}
                ref={setMutationRef}
            >
              <LysMutationProvider
                mutation={MarkAllReadMutation}
                ref={setMarkAllRef}
              >
                <div className="notification-list">
                    <div className="notification-list__header">
                        <button
                            type="button"
                            className="btn btn-link btn-sm notification-list__mark-all"
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0 || isMarkingAll}
                        >
                            {isMarkingAll && (
                                <span className="spinner-border spinner-border-sm me-1" role="status" />
                            )}
                            {t("markAllAsRead")}
                        </button>
                    </div>
                    <Row className="notification-list__filters g-2">
                        <Col xs={12} md={6}>
                            <SelectElement
                                id="notification-list-read-status"
                                label={t("filterReadStatus")}
                                isFloatingLabel
                                nullable
                                nullableLabel={t("filterReadStatusAll")}
                                value={readStatus}
                                onChange={(e) => setReadStatus(e.target.value as "" | "true" | "false")}
                                options={[
                                    {value: "false", label: t("filterReadStatusUnread")},
                                    {value: "true", label: t("filterReadStatusRead")},
                                ]}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <SelectNotificationSeverityRestricted
                                id="notification-list-severity"
                                isFloatingLabel
                                value={severityId}
                                onChange={(e) => setSeverityId(e.target.value)}
                            />
                        </Col>
                    </Row>

                    {items.length === 0 && !queryRef?.isLoading && (
                        <div className="notification-list__empty">
                            {t("noNotifications")}
                        </div>
                    )}

                    {queryRef?.isLoading && items.length === 0 && (
                        <div className="notification-list__loading">
                            <div className="spinner-border spinner-border-sm" role="status" />
                        </div>
                    )}

                    {items.length > 0 && (
                        <ul className="notification-list__items">
                            {items.map((item) => {
                                const severityIcon = SEVERITY_ICONS[item.severityId] ?? DEFAULT_SEVERITY_ICON;
                                const severityClass = `notification-list__item--severity-${item.severityId.toLowerCase()}`;
                                return (
                                    <li
                                        key={item.id}
                                        className={`notification-list__item ${severityClass} ${!item.isRead ? "notification-list__item--unread" : ""}`}
                                        onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                                    >
                                        <span className="notification-list__dot" />
                                        <i
                                            className={`bi ${severityIcon.icon} ${severityIcon.colorClass} notification-list__severity-icon`}
                                            aria-hidden="true"
                                        />
                                        <div className="notification-list__content">
                                            <p className="notification-list__message">
                                                {formatMessage(item.typeId, item.data)}
                                            </p>
                                            <div className="notification-list__time">
                                                {formatTime(item.createdAt)}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {hasNextPage && (
                        <div className="notification-list__load-more">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore && (
                                    <span className="spinner-border spinner-border-sm me-1" role="status" />
                                )}
                                {t("loadMore")}
                            </button>
                        </div>
                    )}
                </div>
              </LysMutationProvider>
            </LysMutationProvider>
        </LysQueryProvider>
    );
};

NotificationListFeature.displayName = "NotificationListFeature";

export default NotificationListFeature;