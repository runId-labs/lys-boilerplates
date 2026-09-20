/**
 * One conversation as rendered in the history list.
 */
export interface AiConversationItem {
    /** Conversation GlobalID, passed back on selection. */
    id: string;

    /**
     * Label to display. Resolved server-side by `displayTitle`, which falls back to
     * the truncated opening message while no title has been generated yet, so it is
     * never empty in practice - it stays nullable because the field is.
     */
    displayTitle: string | null;

    /** Title actually set on the conversation, empty while none was generated. */
    title: string | null;

    /** ISO creation date, rendered in the viewer's locale. */
    createdAt: string;

    /** Set once archived, which swaps the row's action from archive to restore. */
    archivedAt: string | null;
}

export interface AiConversationListFeatureProps {
    conversations: AiConversationItem[];

    /** Called with the conversation the user picked. */
    onSelect: (conversationId: string) => void;

    /** Conversation currently open in the chatbot, highlighted in the list. */
    activeConversationId?: string | null;

    /** Called with the new title. Omit to render the list without renaming. */
    onRename?: (conversationId: string, title: string) => void;

    /** Called with the conversation to archive. Omit to render the list without archiving. */
    onArchive?: (conversationId: string) => void;

    /** Called with the conversation to restore. Omit to render the list without restoring. */
    onUnarchive?: (conversationId: string) => void;
}
