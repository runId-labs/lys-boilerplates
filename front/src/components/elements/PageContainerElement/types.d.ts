import {ReactNode} from "react";

/**
 * Props for PageContainerElement
 */
export interface PageContainerElementProps {
    /**
     * Content to render inside the container
     */
    children: ReactNode;

    /**
     * Additional CSS classes
     */
    className?: string;
}