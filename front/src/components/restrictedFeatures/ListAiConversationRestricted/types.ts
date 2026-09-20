/**
 * ListAiConversationRestricted props (passed as dialog bodyProps).
 */
export interface ListAiConversationRestrictedProps {
    /**
     * Called with the conversation the user picked. The opener owns what happens next -
     * loading its messages and closing the panel - because the panel is mounted outside
     * the chatbot's React tree.
     */
    onConversationSelected: (conversationId: string) => void;

    /** Conversation currently open in the chatbot, highlighted in the list. */
    activeConversationId?: string | null;
}
