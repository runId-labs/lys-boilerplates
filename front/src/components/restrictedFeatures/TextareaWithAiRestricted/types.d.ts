import { TextareaWithAiElementProps } from "@/components/elements/TextareaWithAiElement/types";

/**
 * Props for the TextareaWithAiRestricted component
 */
export interface TextareaWithAiRestrictedProps extends Omit<TextareaWithAiElementProps,
    "onImprove" | "onUndo" | "onRedo" | "isImproving" | "canUndo" | "canRedo"
> {
    /**
     * Optional context for the AI (e.g., "This is a description for a project")
     */
    aiContext?: string;

    /**
     * Language for improvement (default: "fr")
     */
    aiLanguage?: string;

    /**
     * Callback when value changes (from typing or AI improvement)
     */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}