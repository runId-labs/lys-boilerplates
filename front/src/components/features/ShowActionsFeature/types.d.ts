import {ReactNode} from "react";

/**
 * Primary action configuration
 */
export interface PrimaryAction {
    /**
     * Button label (can be string or ReactNode for icons)
     */
    label: ReactNode;

    /**
     * Click handler
     */
    onClick: () => void;

    /**
     * Optional Bootstrap icon class (e.g., "bi-plus")
     */
    icon?: string;

    /**
     * Button variant (default: "primary")
     */
    variant?: "primary" | "secondary" | "outline-primary" | "outline-secondary";

    /**
     * Whether the action is disabled
     */
    disabled?: boolean;
}

/**
 * Secondary action configuration
 */
export interface SecondaryAction {
    /**
     * Unique key for the action
     */
    key: string;

    /**
     * Action label
     */
    label: string;

    /**
     * Optional icon (ReactNode)
     */
    icon?: ReactNode;

    /**
     * Click handler
     */
    onClick: () => void;

    /**
     * Whether the action is disabled
     */
    disabled?: boolean;
}

/**
 * ShowActionsFeature props
 */
export interface ShowActionsFeatureProps {
    /**
     * Primary action configuration (main button)
     * Can be null if hook returns no permission
     */
    primaryAction?: PrimaryAction | null;

    /**
     * Secondary actions (displayed in dropdown)
     * Null values are filtered out (for hooks without permission)
     */
    secondaryActions?: (SecondaryAction | null | undefined)[];
}