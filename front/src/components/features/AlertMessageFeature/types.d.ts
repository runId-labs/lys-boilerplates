import * as React from "react";
import {DatedAlertMessageType} from "lys-front/providers";
import {ToastPlacement} from "@/components/elements/ToastContainerElement/types";

/**
 * Props for the AlertMessageFeature component
 */
export interface AlertMessageFeatureProps {
    /**
     * Messages to display
     */
    messages: DatedAlertMessageType[];

    /**
     * Callback to remove a message
     */
    onRemove: (index: number) => void;

    /**
     * Position of the toast container
     * @default "bottom-end"
     */
    position?: ToastPlacement;

    /**
     * Auto-hide delay in milliseconds
     * @default 5000
     */
    delay?: number;

    /**
     * Enable auto-hide
     * @default true
     */
    autohide?: boolean;

    /**
     * Error codes to ignore (will not display alerts for these codes)
     * Useful for filtering out expected errors like session expiration
     * @default []
     */
    ignoredErrorCodes?: string[];
}