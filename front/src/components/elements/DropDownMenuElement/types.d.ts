import {ReactElement} from "react";

/**
 * Single dropdown item configuration
 */
export interface DropDownItem {
    /**
     * Optional icon to display before the label
     */
    icon?: ReactElement;

    /**
     * Item label text
     */
    label: string;

    /**
     * Click handler for the item
     * If undefined, the item will not be rendered
     */
    onClick?: () => void;

    /**
     * Whether the item is disabled
     */
    disabled?: boolean;

    /**
     * Whether the item is currently active
     */
    active?: boolean;

    /**
     * Optional variant for the item
     */
    variant?: "danger" | "success" | "warning" | "default";
}

/**
 * Menu section (multiple items grouped together)
 * Key is used for React key prop
 */
export type DropDownMenu = Record<string, DropDownItem>;

/**
 * DropDownMenuElement props
 */
export interface DropDownMenuElementProps {
    /**
     * Array of menu sections
     * Sections are separated by dividers
     */
    menus: DropDownMenu[];

    /**
     * Optional custom toggle content
     * Defaults to vertical ellipsis icon
     */
    toggleContent?: ReactElement;

    /**
     * Optional CSS class for the dropdown container
     */
    className?: string;

    /**
     * Button variant for the toggle
     */
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-danger" | "outline-warning" | "outline-info" | "outline-light" | "outline-dark";

    /**
     * Button size
     */
    size?: "sm" | "lg";

    /**
     * Dropdown alignment
     */
    align?: "start" | "end";
}