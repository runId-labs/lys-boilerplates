import {ReactNode} from "react";

/**
 * GetClientUserRestricted props
 */
export interface GetClientUserRestrictedProps {
    /**
     * Client user ID to fetch and manage
     */
    clientUserId: string;

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

    /**
     * Whether to display the default trigger button
     * @default true
     */
    display?: boolean;
}

/**
 * GetClientUserRestricted ref interface
 */
export interface GetClientUserRestrictedRefInterface {
    /**
     * Whether the user has permission to access client user data
     */
    hasPermission: boolean;

    /**
     * Open the client user management offcanvas
     */
    open: () => void;
}
