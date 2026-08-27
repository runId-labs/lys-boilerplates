import {MouseEventHandler, ReactNode} from "react";

/**
 * LinkElement props
 * Pure UI component for rendering links
 */
interface LinkElementProps {
    to: string;
    className?: string;
    onClick?: MouseEventHandler;
    children: ReactNode;
}

export {
    LinkElementProps
};