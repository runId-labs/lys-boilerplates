import {ReactNode} from "react";

/**
 * GetClientRestricted props
 */
export interface GetClientRestrictedProps {
    /**
     * Client ID to fetch and display
     */
    clientId: string;

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
 * GetClientRestricted ref interface
 */
export interface GetClientRestrictedRefInterface {
    /**
     * Whether the user has permission to access client data
     */
    hasPermission: boolean;

    /**
     * Open the client management offcanvas
     */
    open: () => void;
}