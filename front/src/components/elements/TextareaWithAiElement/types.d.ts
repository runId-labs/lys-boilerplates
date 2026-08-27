import { InputElementProps } from "@/components/elements/InputElement/types";

/**
 * Props for the TextareaWithAiElement component
 */
export interface TextareaWithAiElementProps extends Omit<InputElementProps, "as" | "type"> {
    /**
     * Callback when improve button is clicked
     */
    onImprove?: () => void;

    /**
     * Callback when undo button is clicked
     */
    onUndo?: () => void;

    /**
     * Callback when redo button is clicked
     */
    onRedo?: () => void;

    /**
     * Whether improvement is in progress
     */
    isImproving?: boolean;

    /**
     * Whether undo is available (improved text is shown)
     */
    canUndo?: boolean;

    /**
     * Whether redo is available (original text is shown after undo)
     */
    canRedo?: boolean;

    /**
     * Hide the AI improve button
     */
    hideAiButton?: boolean;
}