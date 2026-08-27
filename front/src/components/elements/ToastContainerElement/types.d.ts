import * as React from "react";
import {ReactNode} from "react";

/**
 * Toast placement positions
 */
export type ToastPlacement =
    | "top-start"
    | "top-center"
    | "top-end"
    | "middle-start"
    | "middle-center"
    | "middle-end"
    | "bottom-start"
    | "bottom-center"
    | "bottom-end";

/**
 * Props for the ToastContainerElement component
 */
export interface ToastContainerElementProps {
    /**
     * Position of the toast container
     * @default "bottom-end"
     */
    position?: ToastPlacement;

    /**
     * Toast elements to display
     */
    children: ReactNode;

    /**
     * Custom className
     */
    className?: string;
}