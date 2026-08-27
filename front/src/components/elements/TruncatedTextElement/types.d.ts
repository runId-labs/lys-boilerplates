import {Placement} from "react-bootstrap/types";

/**
 * Props for TruncatedTextElement component
 */
export interface TruncatedTextElementProps {
    /**
     * The text to display (will be truncated if too long)
     */
    text: string;
    /**
     * Optional CSS class name
     */
    className?: string;
    /**
     * Tooltip placement when text is truncated
     * @default "top"
     */
    placement?: Placement;
}