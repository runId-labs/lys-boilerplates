import {useDialogWithUpdates} from "lys-front/providers";
import {useNotificationBellRestrictedTranslations} from "./translations";
import NotificationListFeature from "@/components/features/NotificationListFeature";

const DIALOG_KEY = "notification-panel";

/**
 * Hook to open the notification panel dialog (right side panel)
 */
export const useNotificationPanelDialog = (onMarkAsRead?: () => void, unreadCount?: number) => {
    const {t} = useNotificationBellRestrictedTranslations();

    const dialog = useDialogWithUpdates({
        uniqueKey: DIALOG_KEY,
        title: t("notifications"),
        size: "md",
        placement: "end",
        body: NotificationListFeature,
        bodyProps: {
            onMarkAsRead: onMarkAsRead ? () => onMarkAsRead() : undefined,
            unreadCount
        },
        deps: [onMarkAsRead, unreadCount]
    });

    return {
        open: dialog.open,
        close: dialog.close,
        isOpen: dialog.isOpen,
    };
};