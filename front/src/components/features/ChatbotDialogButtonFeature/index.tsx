import * as React from "react"
import { DialogConfig } from "lys-front/providers"
import { useChatbot } from "lys-front/providers"
import { useChatbotDialogButtonFeatureTranslations } from "./translations"
import "./styles.scss"

interface ChatbotDialogButtonFeatureProps {
    current: DialogConfig
}

/**
 * Chatbot button positioned left of the dialog offcanvas.
 * Visible only when chatbot is enabled and not already in chatbot mode.
 */
const ChatbotDialogButtonFeature: React.FC<ChatbotDialogButtonFeatureProps> = ({ current }) => {
    const { isChatbotMode, isChatbotEnabled, setIsChatbotMode } = useChatbot()
    const { common } = useChatbotDialogButtonFeatureTranslations()

    if (!isChatbotEnabled || isChatbotMode) return null

    return (
        <div
            className={`lys-dialog-chatbot-button offcanvas-size-${current.size || 'default'}`}
            title={common("chatbotName")}
            onClick={() => setIsChatbotMode(true)}
        >
            <i className="bi bi-chat-dots-fill" aria-hidden="true" />
        </div>
    )
}

ChatbotDialogButtonFeature.displayName = "ChatbotDialogButtonFeature"

export default ChatbotDialogButtonFeature
