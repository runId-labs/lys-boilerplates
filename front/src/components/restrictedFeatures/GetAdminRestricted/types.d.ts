import {ReactNode} from "react";

/**
 * GetAdminRestricted props
 */
export interface GetAdminRestrictedProps {
    /**
     * User ID to fetch and manage
     */
    userId: string;

    /**
     * Optional button text override (can be string or icon)
     */
    buttonText?: ReactNode;

    /**
     * Optional button variant
     */
    buttonVariant?: "primary" | "secondary" | "outline-primary" | "outline-secondary";

    /**
     * Optional button size
     */
    buttonSize?: "sm" | "lg";
}

/**
 * GetAdminRestricted ref interface
 */
export interface GetAdminRestrictedRefInterface {
    /**
     * Whether the user has permission to access user data
     */
    hasPermission: boolean;
}