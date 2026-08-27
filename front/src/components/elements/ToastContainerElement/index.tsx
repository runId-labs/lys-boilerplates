import React from "react";
import {ToastContainer} from "react-bootstrap";
import {ToastContainerElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * ToastContainerElement component
 *
 * Container for positioning toast notifications:
 * - Configurable placement (top/middle/bottom + start/center/end)
 * - Default position: bottom-end (bottom-right)
 * - Manages stacking of multiple toasts
 * - Fixed positioning with proper z-index
 */
const ToastContainerElement: React.FC<ToastContainerElementProps> = ({
    position = "bottom-end",
    children,
    className,
}) => {
    return (
        <ToastContainer
            position={position}
            className={cn("toast-container-element", className)}
        >
            {children}
        </ToastContainer>
    );
};

ToastContainerElement.displayName = "ToastContainerElement";

export default ToastContainerElement;