import {ReactNode} from "react";

/**
 * GetSuperUserRestricted props
 */
export interface GetSuperUserRestrictedProps {
    /**
     * Super user ID to fetch and manage
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

    /**
     * Optional render trigger function for custom trigger elements
     */
    renderTrigger?: (onOpen: () => void) => ReactNode;
}

/**
 * GetSuperUserRestricted ref interface
 */
export interface GetSuperUserRestrictedRefInterface {
    /**
     * Whether the user has permission to access super user data
     */
    hasPermission: boolean;
}