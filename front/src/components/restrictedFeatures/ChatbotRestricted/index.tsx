import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState}  from "react";
import {useNavigate} from "react-router-dom";
import {useIntl} from "react-intl";
import {graphql} from "react-relay";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {ChatbotRestrictedRefInterface} from "./types";
import {useChatbotRestrictedTranslations} from "./translations";
import {useStreamingChat, StreamingChatError} from "./useStreamingChat";
import {isErrorKey} from "@/services/i18n/errors";
import {GENERIC_ACTIVITY_LABEL_KEY, estimateTokens} from "./activityLabels";
import {useAlertMessages} from "lys-front/providers";
import {useChatbot} from "lys-front/providers";
import {useConnectedUserInfo} from "lys-front/providers";
import {usePageContext} from "lys-front/providers";
import {FrontendAction} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import ChatbotProposalRestricted from "@/components/restrictedFeatures/ChatbotProposalRestricted";
import {ProposalConfig} from "@/components/restrictedFeatures/ChatbotProposalRestricted/types";
import {useRouteInfo} from "lys-front/providers";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import ButtonElement from "@/components/elements/ButtonElement";
import "./styles.scss";

/**
 * ChatbotRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected chatbot interface
 * - SSE streaming for progressive token display
 * - GraphQL mutation kept for permission check (LysMutationProvider)
 * - Full chat UI with message history
 * - Markdown rendering for AI responses
 * - Error handling
 * - Configurable proposal handling (project supplies the mutations)
 */
interface ChatbotRestrictedProps {
    hideHeader?: boolean;
    /** Whether the chatbot is shown in the enlarged "dialog" mode. */
    isExpanded?: boolean;
    /** Toggle the enlarged mode. When provided, an expand/collapse button appears in the header. */
    onToggleExpand?: () => void;
    /**
     * Proposal configurations keyed by frontend-action type (e.g. "memory_proposal").
     * Each config defines the mutation to run on confirm plus the LLM messages.
     * Empty by default: projects register their own proposal types.
     */
    proposalConfigs?: Record<string, ProposalConfig>;
    /**
     * Maps backend tool names to a translation key describing the activity in
     * business wording (keys must exist in this component's translations).
     * Unknown tools fall back to the generic label.
     */
    activityLabelKeys?: Record<string, string>;
}

const ChatbotRestricted = forwardRef<ChatbotRestrictedRefInterface, ChatbotRestrictedProps>(
    ({hideHeader = false, isExpanded = false, onToggleExpand, proposalConfigs = {}, activityLabelKeys = {}}, ref) => {
        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const {t} = useChatbotRestrictedTranslations();
        const intl = useIntl();
        const navigate = useNavigate();
        const alertMessage = useAlertMessages();
        const {
            messages, conversationId, isStreaming,
            addMessage, updateLastMessage, setConversationId,
            setIsChatbotMode, setIsStreaming, triggerRefresh
        } = useChatbot();
        const {context: pageContext} = usePageContext();
        const {route} = useRouteInfo();
        const {handleSessionExpired} = useConnectedUserInfo();
        const {sendStreamingMessage, abortStreaming} = useStreamingChat(handleSessionExpired);

        /**
         * Resolve the empty-conversation welcome message from the current route's translation namespace,
         * if the route opts in via `showChatbotWelcome`. react-intl displays the key when no translation exists.
         */
        const welcomeMessage = route?.showChatbotWelcome
            ? intl.formatMessage({id: route.transPrefix + "chatbotWelcome"})
            : null;

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
        const [message, setMessage] = useState("");
        // What the assistant is doing while it works. Between the question and the first token
        // the user otherwise faces a blank screen for 25-35 s (measured), with no clue whether
        // anything is happening.
        const [activities, setActivities] = useState<{labelKey: string; running: number; done: number}[]>([]);
        // The server publishes the SIZE of the reasoning stream, never its content: the
        // trace is a draft naming internal tooling. The size is what matters here — it
        // starts within seconds while the answer takes tens of seconds, and unlike a clock
        // it only grows when data actually arrives, so a frozen counter means trouble.
        const [reasoningChars, setReasoningChars] = useState(0);
        const [elapsedSeconds, setElapsedSeconds] = useState(0);
        const [activeProposal, setActiveProposal] = useState<
            {type: string; content: string} | null
        >(null);

        /*******************************************************************************************************************
         *                                                  REFS
         ******************************************************************************************************************/

        const messagesContainerRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLTextAreaElement>(null);
        const pendingContinueRef = useRef<boolean>(false);
        const sendMessageRef = useRef<(msg: string, role: "user" | "system") => void>(() => {});

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Scroll to bottom of messages
         */
        const scrollToBottom = useCallback(() => {
            const container = messagesContainerRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, []);

        /**
         * Handle frontend actions from AI response
         * Returns true if a "Continue" message should be sent after navigation
         */
        const handleFrontendActions = useCallback((actions: FrontendAction[] | null): boolean => {
            if (!actions || actions.length === 0) return false;

            let shouldContinue = false;

            actions.forEach((action) => {
                if (action.type === "navigate" && action.path) {
                    // Substitute path parameters if present
                    let path = action.path;
                    if (action.params) {
                        Object.entries(action.params).forEach(([key, value]) => {
                            path = path.replace(`:${key}`, String(value));
                        });
                    }
                    navigate(path);

                    // Check if we should send "Continue" after navigation
                    if (action.continueAction) {
                        shouldContinue = true;
                    }
                } else if (action.type === "refresh" && action.nodes) {
                    // Trigger refresh for specified node types
                    triggerRefresh(action.nodes);
                } else if (proposalConfigs[action.type] && action.params?.content) {
                    // Handle registered proposal actions (project-supplied configs)
                    setActiveProposal({
                        type: action.type,
                        content: String(action.params.content),
                    });
                }
            });

            return shouldContinue;
        }, [navigate, triggerRefresh, proposalConfigs]);

        // Elapsed time is shown next to the counter for context, never on its own: it keeps
        // running whether or not anything arrives.
        useEffect(() => {
            if (!isStreaming) return;
            const interval = setInterval(() => setElapsedSeconds((current) => current + 1), 1000);
            return () => clearInterval(interval);
        }, [isStreaming]);

        /**
         * Send message to AI via SSE streaming
         * @param messageText - The message to send
         * @param role - The role of the message sender (user or system)
         */
        const sendMessage = useCallback(async (messageText: string, role: "user" | "system" = "user") => {
            if (!mutationRef?.commit || !messageText.trim() || isStreaming) return;

            const trimmedMessage = messageText.trim();

            // Add user message to history
            addMessage({role, content: trimmedMessage});
            setMessage("");

            // Add empty assistant message for streaming
            addMessage({role: "assistant", content: ""});
            setIsStreaming(true);
            setActivities([]);
            setReasoningChars(0);
            setElapsedSeconds(0);

            // Scroll to bottom after adding messages
            setTimeout(scrollToBottom, 100);

            const context = pageContext.pageName ? {
                pageName: pageContext.pageName,
                params: pageContext.params || {}
            } : null;

            try {
                const result = await sendStreamingMessage(
                    trimmedMessage,
                    conversationId,
                    context,
                    (content: string) => {
                        updateLastMessage(content);
                        // Throttled scroll during streaming
                        setTimeout(scrollToBottom, 50);
                    },
                    (activity) => {
                        // Same tool called several times collapses into one line with a
                        // counter, instead of pushing one line per call.
                        const labelKey = activityLabelKeys[activity.name] || GENERIC_ACTIVITY_LABEL_KEY;
                        setActivities((current) => {
                            const existing = current.find((item) => item.labelKey === labelKey);
                            if (!existing) {
                                return [...current, {
                                    labelKey,
                                    running: activity.phase === "start" ? 1 : 0,
                                    done: activity.phase === "result" ? 1 : 0,
                                }];
                            }
                            return current.map((item) => item.labelKey !== labelKey ? item : {
                                ...item,
                                running: item.running + (activity.phase === "start" ? 1 : 0),
                                done: item.done + (activity.phase === "result" ? 1 : 0),
                            });
                        });
                        setTimeout(scrollToBottom, 50);
                    },
                    (characters) => {
                        setReasoningChars(characters);
                    },
                );

                // Update conversation ID
                if (result.conversationId) {
                    setConversationId(result.conversationId);
                }

                // Handle frontend actions
                const shouldContinue = handleFrontendActions(result.frontendActions);
                if (shouldContinue) {
                    pendingContinueRef.current = true;
                }

                setTimeout(scrollToBottom, 100);
            } catch (e) {
                // A known backend error code is passed through as-is: AlertMessageFeature
                // translates it via isErrorKey when rendering, same convention as GraphQL
                // mutation errors elsewhere in the app. Anything else (network failure,
                // unrecognized code) falls back to the generic message.
                const code = e instanceof StreamingChatError ? e.code : null;
                alertMessage.merge([{
                    text: code && isErrorKey(code) ? code : t("errorMessage"),
                    level: "ERROR"
                }]);
            } finally {
                setIsStreaming(false);
            }
        }, [
            mutationRef, conversationId, pageContext, isStreaming,
            alertMessage, t, scrollToBottom, addMessage, updateLastMessage,
            setConversationId, setIsStreaming, handleFrontendActions, sendStreamingMessage,
        ]);

        // Keep ref in sync for use in dialog callbacks (avoids circular dependency)
        sendMessageRef.current = sendMessage;

        /**
         * Reset textarea height to default single row
         */
        const resetTextareaHeight = useCallback(() => {
            if (inputRef.current) {
                inputRef.current.style.height = "auto";
            }
        }, []);

        /**
         * Handle form submission
         */
        const handleSubmit = useCallback((e: React.FormEvent) => {
            e.preventDefault();
            void sendMessage(message);
            resetTextareaHeight();
        }, [sendMessage, message, resetTextareaHeight]);

        /**
         * Handle key press (Enter to send)
         */
        const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(message);
                resetTextareaHeight();
            }
        }, [sendMessage, message, resetTextareaHeight]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        /**
         * Focus input on mount
         */
        useEffect(() => {
            if (mutationRef?.commit) {
                inputRef.current?.focus();
            }
        }, [mutationRef?.commit]);

        /**
         * Handle pending continue action after navigation
         * When page context changes and there's a pending continue, send "Continue" message
         */
        useEffect(() => {
            if (pendingContinueRef.current && mutationRef?.commit && !isStreaming) {
                pendingContinueRef.current = false;
                // Small delay to ensure the new page context is properly set
                setTimeout(() => {
                    sendMessage("Continue");
                }, 300);
            }
        }, [pageContext.pageName, mutationRef, isStreaming, sendMessage]);

        /**
         * Abort streaming on unmount
         */
        useEffect(() => {
            return () => {
                abortStreaming();
            };
        }, [abortStreaming]);

        /**
         * Expose hasPermission via ref
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit
        }), [mutationRef?.commit]);

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={graphql`
                    mutation ChatbotRestrictedMutation($inputs: AIMessageInput!) {
                        sendAiMessage(inputs: $inputs) {
                            content
                            conversationId
                            toolCallsCount
                            toolResults {
                                toolName
                                result
                                success
                            }
                            frontendActions {
                                type
                                path
                                params
                                nodes
                                continueAction
                            }
                            message
                        }
                    }
                `}
                ref={setMutationRef}
            >
                {mutationRef?.commit && (
                    <div className={`chatbot-restricted ${isExpanded ? "chatbot-restricted--expanded" : ""}`}>
                        {/* Chat content */}
                        <div className="chatbot-content">
                        {/* Header */}
                        {!hideHeader && (
                            <div className="chatbot-header">
                                <div className="chatbot-title-group">
                                    <h5 className="chatbot-title">{t("title")}</h5>
                                    <p className="chatbot-subtitle">{t("subtitle")}</p>
                                </div>
                                <div className="chatbot-header-actions">
                                    {onToggleExpand && (
                                        <ButtonElement
                                            variant="link"
                                            size="sm"
                                            onClick={onToggleExpand}
                                            aria-label={isExpanded ? t("reduceWindow") : t("enlargeWindow")}
                                            title={isExpanded ? t("reduceWindow") : t("enlargeWindow")}
                                        >
                                            <i className={`bi ${isExpanded ? "bi-arrows-angle-contract" : "bi-arrows-angle-expand"}`}></i>
                                        </ButtonElement>
                                    )}
                                    <ButtonElement
                                        variant="link"
                                        size="sm"
                                        onClick={() => setIsChatbotMode(false)}
                                        aria-label={t("close")}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </ButtonElement>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="chatbot-messages" ref={messagesContainerRef}>
                            {/* Welcome message when conversation is empty */}
                            {messages.length === 0 && welcomeMessage && (
                                <div className="chatbot-message assistant welcome">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{welcomeMessage}</ReactMarkdown>
                                </div>
                            )}
                            {messages
                                .filter((msg) => msg.role !== "system")
                                .map((msg, index) => {
                                    // Show loading dots for empty streaming assistant message
                                    const isEmptyStreaming = isStreaming
                                        && msg.role === "assistant"
                                        && msg.content === ""
                                        && index === messages.filter(m => m.role !== "system").length - 1;

                                    return (
                                        <div
                                            key={index}
                                            className={`chatbot-message ${msg.role}${isEmptyStreaming ? " loading" : ""}`}
                                        >
                                            {isEmptyStreaming ? (
                                                reasoningChars > 0 || activities.length > 0 ? (
                                                <>
                                                    {activities.length > 0 && (
                                                    <ul className="chatbot-activity">
                                                        {activities.map((activity) => {
                                                            const total = activity.running || activity.done;
                                                            const finished = activity.done >= total;
                                                            return (
                                                                <li key={activity.labelKey} className={finished ? "done" : "running"}>
                                                                    <i className={`bi ${finished ? "bi-check2" : "bi-arrow-repeat"}`}></i>
                                                                    <span>{t(activity.labelKey as Parameters<typeof t>[0])}</span>
                                                                    {total > 1 && (
                                                                        <span className="count">{activity.done}/{total}</span>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                        <li className="running">
                                                            <i className="bi bi-arrow-repeat"></i>
                                                            <span>{t("activityWriting")}</span>
                                                        </li>
                                                    </ul>
                                                    )}
                                                {reasoningChars > 0 && (
                                                    <p className="chatbot-reasoning">
                                                        {t("thinking")} {elapsedSeconds} s · {estimateTokens(reasoningChars)} tokens
                                                    </p>
                                                )}
                                            </>
                                                ) : (
                                                    <i className="bi bi-three-dots"></i>
                                                )
                                            ) : msg.role === "assistant" ? (
                                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{msg.content}</ReactMarkdown>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Input or Proposal */}
                        <div className="chatbot-input">
                            {activeProposal ? (
                                <ChatbotProposalRestricted
                                    content={activeProposal.content}
                                    config={proposalConfigs[activeProposal.type]}
                                    pageParams={pageContext.params || {}}
                                    onComplete={(msg) => {
                                        setActiveProposal(null);
                                        sendMessage(msg, "system");
                                    }}
                                />
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <InputGroup>
                                        <Form.Control
                                            ref={inputRef}
                                            as="textarea"
                                            rows={1}
                                            placeholder={t("placeholder")}
                                            value={message}
                                            onChange={(e) => {
                                                setMessage(e.target.value);
                                                e.target.style.height = "auto";
                                                e.target.style.height = `${e.target.scrollHeight}px`;
                                            }}
                                            onKeyDown={handleKeyPress}
                                            disabled={isStreaming}
                                            aria-label={t("placeholder")}
                                        />
                                        <ButtonElement
                                            type="submit"
                                            variant="primary"
                                            disabled={!message.trim() || isStreaming}
                                        >
                                            <i className="bi bi-send"></i>
                                        </ButtonElement>
                                    </InputGroup>
                                </Form>
                            )}
                        </div>
                    </div>{/* end chatbot-content */}
                    </div>
                )}
            </LysMutationProvider>
        );
    }
);

ChatbotRestricted.displayName = "ChatbotRestricted";

export default ChatbotRestricted;