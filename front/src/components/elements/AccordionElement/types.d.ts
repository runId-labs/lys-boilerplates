import {ReactNode} from "react";

/**
 * Single accordion item definition
 */
export interface AccordionItemDef {
    /**
     * Unique key for the item
     */
    key: string;

    /**
     * Title displayed in the accordion header
     */
    title: string;

    /**
     * Optional description shown as a tooltip on hover of the title.
     * Useful to clarify what the section measures without cluttering the header.
     */
    description?: string;

    /**
     * Optional count displayed as a grey rounded badge to the right of the title
     */
    count?: number | null;

    /**
     * Optional free content rendered in the header AFTER the count (e.g. a status
     * badge). Kept separate from `title` so title + count stay adjacent.
     */
    extraTitle?: ReactNode;

    /**
     * Body content rendered when the item is expanded
     */
    body: ReactNode;
}

/**
 * Props for the AccordionElement component
 */
export interface AccordionElementProps {
    /**
     * List of accordion items to render
     */
    items: AccordionItemDef[];

    /**
     * Keys of items that should be open by default.
     * If not provided, all items are collapsed.
     */
    defaultActiveKeys?: string[];

    /**
     * Whether to allow multiple items open at once (default: true)
     */
    alwaysOpen?: boolean;

    /**
     * Whether the accordion is flush (no outer borders/rounded corners)
     */
    flush?: boolean;

    /**
     * Additional className for the root element
     */
    className?: string;
}
