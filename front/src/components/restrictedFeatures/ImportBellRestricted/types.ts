export interface ImportBellRestrictedProps {
    /**
     * Notification types (NEW_NOTIFICATION signal type_id values) that trigger a
     * debounced badge refresh. Empty by default: lys defines no import
     * notification type, projects list their own.
     */
    refreshNotificationTypes?: string[];
}

export interface ImportBellRestrictedRefInterface {
    hasPermission: boolean;
}
