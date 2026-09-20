import React, {useMemo, useState} from "react";
import {useIntl} from "react-intl";
import {AiConversationListFeatureProps} from "./types";
import {useAiConversationListFeatureTranslations} from "./translations";
import ButtonElement from "@/components/elements/ButtonElement";
import "./styles.scss";

/**
 * AiConversationListFeature
 *
 * Presentational list of past chatbot conversations: pick one, rename it in place, or
 * archive it. Renaming edits inline rather than opening a dialog - the list lives inside
 * the narrow chatbot column, where a dialog would cover the very thing being renamed.
 */
const AiConversationListFeature: React.FC<AiConversationListFeatureProps> = ({
    conversations,
    onSelect,
    activeConversationId,
    onRename,
    onArchive,
    onUnarchive
}) => {
    const {t} = useAiConversationListFeatureTranslations();
    const {locale} = useIntl();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftTitle, setDraftTitle] = useState("");

    // Built from the viewer's locale rather than a fixed one: the same list is read in
    // both languages the app ships.
    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, {day: "numeric", month: "short", year: "numeric"}),
        [locale]
    );

    const formatDate = (value: string): string => {
        const date = new Date(value);
        return isNaN(date.getTime()) ? "" : dateFormatter.format(date);
    };

    const startEdit = (conversationId: string, currentTitle: string) => {
        setEditingId(conversationId);
        setDraftTitle(currentTitle);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setDraftTitle("");
    };

    const commitEdit = (conversationId: string) => {
        const title = draftTitle.trim();

        // An empty title is refused server-side, and would read as an untitled
        // conversation here: treat it as a cancel rather than a failed save.
        if (title && onRename) {
            onRename(conversationId, title);
        }

        cancelEdit();
    };

    if (conversations.length === 0) {
        return <p className="text-muted mb-0">{t("empty")}</p>;
    }

    return (
        <ul className="ai-conversation-list-feature">
            {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                const isEditing = conversation.id === editingId;
                const isArchived = conversation.archivedAt !== null;

                if (isEditing) {
                    return (
                        <li key={conversation.id} className="ai-conversation-list-feature__row">
                            <input
                                className="form-control form-control-sm"
                                value={draftTitle}
                                autoFocus
                                aria-label={t("renameLabel")}
                                onChange={(event) => setDraftTitle(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") commitEdit(conversation.id);
                                    if (event.key === "Escape") cancelEdit();
                                }}
                            />
                            <ButtonElement
                                variant="link"
                                size="sm"
                                onClick={() => commitEdit(conversation.id)}
                                aria-label={t("save")}
                                title={t("save")}
                            >
                                <i className="bi bi-check-lg"></i>
                            </ButtonElement>
                            <ButtonElement
                                variant="link"
                                size="sm"
                                onClick={cancelEdit}
                                aria-label={t("cancel")}
                                title={t("cancel")}
                            >
                                <i className="bi bi-x-lg"></i>
                            </ButtonElement>
                        </li>
                    );
                }

                return (
                    <li
                        key={conversation.id}
                        className={`ai-conversation-list-feature__row${
                            isActive ? " ai-conversation-list-feature__row--active" : ""
                        }${isArchived ? " ai-conversation-list-feature__row--archived" : ""}`}
                    >
                        <button
                            type="button"
                            className={`ai-conversation-list-feature__item${
                                isActive ? " ai-conversation-list-feature__item--active" : ""
                            }`}
                            onClick={() => onSelect(conversation.id)}
                            aria-current={isActive || undefined}
                        >
                            <span className="ai-conversation-list-feature__title">
                                {conversation.displayTitle || t("untitled")}
                            </span>
                            <span className="ai-conversation-list-feature__meta text-muted">
                                {formatDate(conversation.createdAt)}
                                {isActive && ` · ${t("current")}`}
                                {isArchived && ` · ${t("archived")}`}
                            </span>
                        </button>

                        {onRename && (
                            <ButtonElement
                                variant="link"
                                size="sm"
                                onClick={() => startEdit(conversation.id, conversation.title ?? "")}
                                aria-label={t("rename")}
                                title={t("rename")}
                            >
                                <i className="bi bi-pencil"></i>
                            </ButtonElement>
                        )}
                        {isArchived
                            ? onUnarchive && (
                                <ButtonElement
                                    variant="link"
                                    size="sm"
                                    onClick={() => onUnarchive(conversation.id)}
                                    aria-label={t("unarchive")}
                                    title={t("unarchive")}
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                </ButtonElement>
                            )
                            : onArchive && (
                                <ButtonElement
                                    variant="link"
                                    size="sm"
                                    onClick={() => onArchive(conversation.id)}
                                    aria-label={t("archive")}
                                    title={t("archive")}
                                >
                                    <i className="bi bi-archive"></i>
                                </ButtonElement>
                            )}
                    </li>
                );
            })}
        </ul>
    );
};

AiConversationListFeature.displayName = "AiConversationListFeature";

export default AiConversationListFeature;
