import {ReactNode} from "react";

/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * GetUserRestricted props
 */
export interface GetUserRestrictedProps {
    /**
     * User ID to fetch and manage
     */
    userId: string;

    /**
     * Access parameters for OWNER permission checking
     * ownerIds should contain the user IDs who own this resource
     */
    accessParameters?: AccessParameters | null;

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
 * GetUserRestricted ref interface
 */
export interface GetUserRestrictedRefInterface {
    /**
     * Whether the user has permission to access user data
     */
    hasPermission: boolean;

    /**
     * Open the user management offcanvas
     */
    open: () => void;
}