export interface ImportListRestrictedProps {
    /**
     * Maps a backend import type code to a translation key of this component's
     * translations, shown as the type badge (e.g. {INVOICE_IMPORT: "invoiceImport"}).
     * Unknown types display the raw code.
     */
    typeLabelKeys?: Record<string, string>;

    /**
     * Notification types (NEW_NOTIFICATION signal type_id values) that trigger a
     * debounced list refresh. Empty by default: lys defines no import notification
     * type, projects list their own.
     */
    refreshNotificationTypes?: string[];
}
