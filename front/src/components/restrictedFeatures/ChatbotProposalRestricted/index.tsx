import React, {useCallback, useRef, useState} from "react";
import {ChatbotProposalRestrictedProps} from "./types";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import ChatbotProposalFeature from "@/components/features/ChatbotProposalFeature";

/**
 * ChatbotProposalRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected proposal handling
 * - GraphQL mutation via LysMutationProvider
 * - Wraps ChatbotProposalFeature with mutation logic
 *
 * This component handles the confirm/modify/dismiss flow for chatbot proposals.
 * It executes the appropriate mutation and sends system messages to the LLM.
 */
const ChatbotProposalRestricted: React.FC<ChatbotProposalRestrictedProps> = ({
    content,
    config,
    pageParams,
    onComplete,
}) => {
    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    /**
     * Track the original content to detect modifications
     */
    const originalContentRef = useRef(content);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle confirm action
     * Executes the mutation and calls onComplete with appropriate message
     */
    const handleConfirm = useCallback((confirmedContent: string) => {
        if (!mutationRef?.commit) return;

        const isModified = confirmedContent !== originalContentRef.current;
        const variables = config.buildVariables(confirmedContent, pageParams);

        mutationRef.commit({
            variables,
            onCompleted: () => {
                const message = isModified
                    ? config.modifiedMessage(originalContentRef.current, confirmedContent)
                    : config.successMessage(confirmedContent);
                onComplete(message);
            },
            onError: () => {
                onComplete(config.errorMessage);
            }
        });
    }, [mutationRef, config, pageParams, onComplete]);

    /**
     * Handle dismiss action
     * Sends dismiss message to LLM without executing mutation
     */
    const handleDismiss = useCallback(() => {
        onComplete(config.dismissMessage);
    }, [config.dismissMessage, onComplete]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysMutationProvider
            mutation={config.mutation}
            ref={setMutationRef}
        >
            {mutationRef?.commit && (
                <ChatbotProposalFeature
                    content={content}
                    allowEdit={config.allowEdit !== false}
                    onConfirm={handleConfirm}
                    onDismiss={handleDismiss}
                    isLoading={mutationRef.isInFlight}
                />
            )}
        </LysMutationProvider>
    );
};

ChatbotProposalRestricted.displayName = "ChatbotProposalRestricted";

export default ChatbotProposalRestricted;
