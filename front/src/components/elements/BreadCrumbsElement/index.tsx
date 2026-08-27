import React from "react";
import {Breadcrumb} from "react-bootstrap";
import LinkElement from "@/components/elements/LinkElement";
import "./styles.scss";

export interface BreadcrumbItem {
    /**
     * Display label for the breadcrumb
     */
    label: string;

    /**
     * URL path for the breadcrumb link
     */
    path: string;
}

export interface BreadCrumbsElementProps {
    /**
     * Breadcrumb items to display (excluding current page)
     */
    items: BreadcrumbItem[];

    /**
     * Current page label (displayed as active, non-clickable)
     */
    currentPageLabel: string;
}

/**
 * BreadCrumbsElement component
 *
 * Element component (Layer 1) - Pure UI for breadcrumb navigation
 *
 * Features:
 * - Breadcrumb navigation using React-Bootstrap
 * - Link navigation via LinkElement
 * - Active state for current page
 *
 * This is a pure Element (Layer 1) - no context hooks.
 * Breadcrumb data should be pre-computed by the parent component.
 */
const BreadCrumbsElement: React.FC<BreadCrumbsElementProps> = ({
    items,
    currentPageLabel
}) => {
    return (
        <Breadcrumb className="breadcrumbs-element">
            {items.map((item, index) => (
                <Breadcrumb.Item
                    key={`breadcrumb-${index}`}
                    linkAs={LinkElement}
                    linkProps={{to: item.path}}
                >
                    {item.label}
                </Breadcrumb.Item>
            ))}

            {/* Current page (active, non-clickable) */}
            <Breadcrumb.Item active>
                {currentPageLabel}
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

BreadCrumbsElement.displayName = "BreadCrumbsElement";

export default BreadCrumbsElement;