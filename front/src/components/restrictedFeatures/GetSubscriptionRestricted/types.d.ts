import {ReactNode} from "react";

/**
 * GetSubscriptionRestricted props
 */
export interface GetSubscriptionRestrictedProps {
    /**
     * Subscription ID to fetch and display
     */
    subscriptionId: string;

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

    /**
     * Whether the panel offers the plan selection. That path is the client's
     * own checkout: an administrator acting on their behalf subscribes them
     * manually instead.
     * @default true
     */
    allowPlanChange?: boolean;
}

/**
 * GetSubscriptionRestricted ref interface
 */
export interface GetSubscriptionRestrictedRefInterface {
    /**
     * Whether the user has permission to access subscription data
     */
    hasPermission: boolean;

    /**
     * Open the subscription management offcanvas
     */
    open: () => void;
}