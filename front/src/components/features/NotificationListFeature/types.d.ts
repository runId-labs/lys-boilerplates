export interface NotificationListFeatureProps {
    onMarkAsRead?: (ids: string[]) => void;
    /** Current global unread count (from the bell) — drives the "mark all as read" disabled state. */
    unreadCount?: number;
}