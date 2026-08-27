import "./styles.scss";
import React from "react";
import {PageContainerElementProps} from "./types";

/**
 * PageContainerElement component
 *
 * Simple container element for page content with consistent padding
 * Used to wrap main content of pages for consistent spacing
 */
const PageContainerElement: React.FC<PageContainerElementProps> = ({
    children,
    className = ""
}) => {
    return (
        <div className={`page-container-element ${className}`}>
            {children}
        </div>
    );
};

PageContainerElement.displayName = "PageContainerElement";

export default PageContainerElement;