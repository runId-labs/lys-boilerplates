import {ReactNode} from "react";
import {HasPermissionRefInterface} from "lys-front/providers";

/**
 * Access parameters for owner-based permission checking
 */
export interface AccessParameters {
    ownerIds: string[];
}

/**
 * Configurable event channel (email or notification)
 */
export interface ConfigurableChannel {
    default: boolean;
    configurable: boolean;
}

/**
 * Configurable event type with email and notification channels
 */
export interface ConfigurableEvent {
    eventType: string;
    email: ConfigurableChannel;
    notification: ConfigurableChannel;
}

/**
 * User event preference (custom override)
 */
export interface UserEventPreference {
    id: string;
    eventType: string;
    channel: string;
    enabled: boolean;
}

/**
 * UpdateUserEventPreferencesRestricted props
 */
export interface UpdateUserEventPreferencesRestrictedProps {
    /**
     * Access parameters for OWNER permission checking
     */
    accessParameters?: AccessParameters | null;

    /**
     * Optional footer content for the card
     */
    footer?: ReactNode;

    /**
     * Optional callback called after successful mutation
     */
    onCompleted?: (response: any) => void;
}

/**
 * UpdateUserEventPreferencesRestricted ref interface
 */
export type UpdateUserEventPreferencesRestrictedRefInterface = HasPermissionRefInterface;