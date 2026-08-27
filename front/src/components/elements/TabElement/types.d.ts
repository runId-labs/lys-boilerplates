import {ReactElement} from "react";

/**
 * Tab item configuration
 */
export interface TabItem {
    /**
     * Tab label text
     */
    label: string;

    /**
     * Optional icon (Bootstrap Icons class)
     */
    icon?: string;

    /**
     * Render function for tab content
     */
    render: () => ReactElement;

    /**
     * Condition to show/hide the tab (default: true)
     */
    visible?: boolean;
}

/**
 * TabElement props
 */
export interface TabElementProps {
    /**
     * Unique key for the tab component
     */
    uniqueKey?: string;

    /**
     * Tab items configuration
     * Key: unique identifier for the tab
     * Value: TabItem configuration
     */
    items: Record<string, TabItem>;

    /**
     * Default active tab key
     */
    defaultActiveKey?: string;

    /**
     * Callback when active tab changes
     */
    onTabChange?: (key: string) => void;

    /**
     * Additional CSS classes
     */
    className?: string;
}
