import {GraphQLTaggedNode} from "react-relay";

/**
 * Configuration for a proposal type
 *
 * Defines how to handle a specific type of proposal (mutation, messages, etc.)
 */
export interface ProposalConfig {
    /**
     * GraphQL mutation to execute when confirming the proposal
     */
    mutation: GraphQLTaggedNode;

    /**
     * Build mutation variables from content and page params
     */
    buildVariables: (content: string, params: Record<string, unknown>) => object;

    /**
     * Generate success message for the LLM
     */
    successMessage: (content: string) => string;

    /**
     * Error message for the LLM
     */
    errorMessage: string;

    /**
     * Message when user dismisses the proposal
     */
    dismissMessage: string;

    /**
     * Generate message when user modifies the content before confirming
     */
    modifiedMessage: (oldContent: string, newContent: string) => string;

    /**
     * Whether to allow editing the proposal content (default: true)
     */
    allowEdit?: boolean;
}

/**
 * ChatbotProposalRestricted props
 */
export interface ChatbotProposalRestrictedProps {
    /**
     * Original proposal content from the AI
     */
    content: string;

    /**
     * Proposal configuration (mutation, messages, etc.)
     */
    config: ProposalConfig;

    /**
     * Page parameters for building mutation variables
     */
    pageParams: Record<string, unknown>;

    /**
     * Callback when proposal is completed (success, error, or dismiss)
     * Receives the message to send to the LLM
     */
    onComplete: (message: string) => void;
}
