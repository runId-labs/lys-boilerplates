import React, {useEffect, useState} from "react";
import ChatbotRestricted from "@/components/restrictedFeatures/ChatbotRestricted";
import {useChatbot} from "lys-front/providers";
import {useSidebarMenuFeatureTranslations} from "./translations";
import "./styles.scss";

/**
 * SidebarMenuFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Left sidebar with chatbot toggle
 * - Chatbot mode (expanded sidebar with ChatbotRestricted)
 *
 * Navigation has moved to the NavBarFeature header.
 */
const SidebarMenuFeature: React.FC = () => {

    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {isChatbotMode, setIsChatbotMode} = useChatbot();
    const {common} = useSidebarMenuFeatureTranslations();

    // Enlarged "dialog" mode — local to the front, no coupling to the chatbot backend.
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset the enlarged mode whenever the chatbot is closed, so it reopens in sidebar size.
    useEffect(() => {
        if (!isChatbotMode) {
            setIsExpanded(false);
        }
    }, [isChatbotMode]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    // Chatbot mode: expanded sidebar with chatbot
    if (isChatbotMode) {
        return (
            <div className={`sidebar-menu-feature chatbot-mode ${isExpanded ? "is-expanded" : ""}`}>
                {isExpanded && (
                    <div
                        className="chatbot-backdrop"
                        onClick={() => setIsExpanded(false)}
                        aria-hidden="true"
                    />
                )}
                <ChatbotRestricted
                    isExpanded={isExpanded}
                    onToggleExpand={() => setIsExpanded((v) => !v)}
                />
            </div>
        );
    }

    // Default: collapsed sidebar with chatbot icon only
    return (
        <div className="sidebar-menu-feature collapsed">
            <div className="sidebar-icons">
                <div
                    className="sidebar-icon chatbot-icon"
                    title={common("chatbotName")}
                    onClick={() => setIsChatbotMode(true)}
                >
                    <i className="bi bi-chat-dots-fill" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    );
};

SidebarMenuFeature.displayName = "SidebarMenuFeature";

export default SidebarMenuFeature;