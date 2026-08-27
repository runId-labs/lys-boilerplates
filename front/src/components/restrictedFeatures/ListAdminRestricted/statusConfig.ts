/**
 * User status configuration
 * Maps status codes to Bootstrap badge variants and translation keys
 */

export type UserStatusCode = "ENABLED" | "DISABLED" | "REVOKED" | "DELETED";

export interface StatusConfig {
    /**
     *
     * Bootstrap badge variant (color)
     */
    variant: "success" | "danger" | "warning" | "secondary" | "info" | "primary";

    /**
     * Translation key for the status label
     */
    translationKey: string;
}

/**
 * Status configuration mapping
 */
export const userStatusConfig: Record<UserStatusCode | "unknown", StatusConfig> = {
    ENABLED: {
        variant: "success",
        translationKey: "statusEnabled"
    },
    DISABLED: {
        variant: "secondary",
        translationKey: "statusDisabled"
    },
    REVOKED: {
        variant: "danger",
        translationKey: "statusRevoked"
    },
    DELETED: {
        variant: "secondary",
        translationKey: "statusDeleted"
    },
    unknown: {
        variant: "secondary",
        translationKey: "statusUnknown"
    }
};
