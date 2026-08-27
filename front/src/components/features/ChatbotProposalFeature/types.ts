/**
 * ChatbotProposalFeature types
 *
 * Types for the chatbot proposal UI component.
 */

export interface ChatbotProposalFeatureProps {
    /**
     * The proposal content to display
     */
    content: string;

    /**
     * Whether the proposal can be edited
     */
    allowEdit?: boolean;

    /**
     * Callback when user confirms the proposal (with possibly modified content)
     */
    onConfirm: (content: string) => void;

    /**
     * Callback when user dismisses the proposal
     */
    onDismiss: () => void;

    /**
     * Whether the mutation is in progress
     */
    isLoading?: boolean;
}
