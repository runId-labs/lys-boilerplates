import * as React from "react";
import {ReactNode} from "react";

/**
 * Toast variant types matching alert levels
 */
export type ToastVariant =
    | "default"   // Maps to INFO (light background)
    | "success"   // Maps to SUCCESS (green)
    | "warning"   // Maps to WARNING (yellow/orange)
    | "danger"    // Maps to ERROR/CRITICAL (red)
    | "info";     // Maps to INFO (blue)

/**
 * Props for the ToastElement component
 */
export interface ToastElementProps {
    /**
     * Visual variant of the toast
     * @default "default"
     */
    variant?: ToastVariant;

    /**
     * Toast title (optional)
     */
    title?: ReactNode | string | null;

    /**
     * Toast body content (required)
     */
    body: ReactNode | string;

    /**
     * Toast footer (optional)
     */
    footer?: ReactNode | string | null;

    /**
     * Whether the toast is visible
     * @default true
     */
    show?: boolean;

    /**
     * Callback when toast is closed
     */
    onClose?: () => void;

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
     * Custom className for the toast
     */
    className?: string;

    /**
     * Custom className for the header
     */
    headerClassName?: string;

    /**
     * Custom className for the body
     */
    bodyClassName?: string;

    /**
     * Custom className for the footer
     */
    footerClassName?: string;

    /**
     * Occurrence count shown as a small badge in the top-right corner.
     * Hidden when undefined or <= 1.
     */
    badgeCount?: number;
}
