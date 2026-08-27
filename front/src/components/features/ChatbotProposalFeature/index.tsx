import React, {useCallback, useState} from "react";
import {ChatbotProposalFeatureProps} from "./types";
import {useChatbotProposalFeatureTranslations} from "./translations";
import ButtonElement from "@/components/elements/ButtonElement";
import "./styles.scss";

/**
 * ChatbotProposalFeature component
 *
 * Feature component (Layer 2) that provides:
 * - UI for chatbot proposals (e.g. memory proposals)
 * - Confirm, Modify, and Dismiss actions
 * - Edit mode for content modification
 * - Loading state during mutation
 *
 * This component displays a proposal card that replaces the text input
 * when the AI suggests saving information.
 */
const ChatbotProposalFeature: React.FC<ChatbotProposalFeatureProps> = ({
    content,
    allowEdit = true,
    onConfirm,
    onDismiss,
    isLoading = false,
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useChatbotProposalFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle confirm button click
     */
    const handleConfirm = useCallback(() => {
        const value = isEditing ? editedContent.trim() : content;
        onConfirm(value);
    }, [isEditing, editedContent, content, onConfirm]);

    /**
     * Handle modify button click - enter edit mode
     */
    const handleModify = useCallback(() => {
        setIsEditing(true);
        setEditedContent(content);
    }, [content]);

    /**
     * Handle cancel edit - exit edit mode
     */
    const handleCancelEdit = useCallback(() => {
        setIsEditing(false);
        setEditedContent(content);
    }, [content]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <div className="chatbot-proposal">
            <div className="chatbot-proposal__title">
                {t("title")}
            </div>

            <div className={`chatbot-proposal__content ${!isEditing ? "chatbot-proposal__content--readonly" : ""}`}>
                {isEditing ? (
                    <textarea
                        className="chatbot-proposal__textarea"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                    />
                ) : (
                    content
                )}
            </div>

            <div className="chatbot-proposal__actions">
                {isEditing ? (
                    <>
                        <ButtonElement
                            className="chatbot-proposal__button"
                            variant="primary"
                            size="sm"
                            onClick={handleConfirm}
                            disabled={isLoading || !editedContent.trim()}
                        >
                            {isLoading ? (
                                <i className="bi bi-arrow-repeat spin"></i>
                            ) : (
                                t("confirmModification")
                            )}
                        </ButtonElement>
                        <ButtonElement
                            className="chatbot-proposal__button"
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                        >
                            {t("cancel")}
                        </ButtonElement>
                    </>
                ) : (
                    <>
                        <ButtonElement
                            className="chatbot-proposal__button"
                            variant="primary"
                            size="sm"
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <i className="bi bi-arrow-repeat spin"></i>
                            ) : (
                                t("confirm")
                            )}
                        </ButtonElement>
                        {allowEdit && (
                            <ButtonElement
                                className="chatbot-proposal__button"
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleModify}
                                disabled={isLoading}
                            >
                                {t("modify")}
                            </ButtonElement>
                        )}
                        <ButtonElement
                            className="chatbot-proposal__button"
                            variant="outline-danger"
                            size="sm"
                            onClick={onDismiss}
                            disabled={isLoading}
                        >
                            {t("dismiss")}
                        </ButtonElement>
                    </>
                )}
            </div>
        </div>
    );
};

ChatbotProposalFeature.displayName = "ChatbotProposalFeature";

export default ChatbotProposalFeature;
