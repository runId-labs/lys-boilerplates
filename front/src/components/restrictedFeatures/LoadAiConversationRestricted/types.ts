import {ChatMessage} from "lys-front/providers";

export interface LoadAiConversationRestrictedProps {
    /** Conversation to replay, as the GlobalID the client handles everywhere. */
    conversationId: string;

    /** Called once the conversation's messages are available. */
    onLoaded: (messages: ChatMessage[]) => void;
}
