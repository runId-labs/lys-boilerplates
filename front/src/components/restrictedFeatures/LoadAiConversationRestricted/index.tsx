import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {LysQueryProvider, LysQueryRefInterface, ChatMessage} from "lys-front/providers";
import {LoadAiConversationRestrictedProps} from "./types";
import {LoadAiConversationRestrictedQuery} from "./__generated__/LoadAiConversationRestrictedQuery.graphql";

/**
 * LoadAiConversationRestricted
 *
 * Headless: replays one conversation's messages and hands them to its caller. Mounted
 * only while a conversation is being resumed, so the query runs once per selection
 * rather than sitting in the chatbot's tree for the whole session.
 *
 * The server already drops tool rows and empty assistant turns, so what comes back is
 * exactly the exchange as the user lived it.
 */

/**
 * How many turns a resumed conversation replays.
 *
 * Read newest-first and reversed for display rather than in chronological order: past
 * this cap, a conversation must keep its most recent turns, since resuming on a stale
 * opening while the recent exchange is hidden would be worse than a short history.
 * Descending also keeps a real SQL LIMIT, where Relay's `last` loads every row of the
 * conversation before slicing them in memory.
 */
const REPLAYED_MESSAGES = 200;

const ReplayQuery = graphql`
    query LoadAiConversationRestrictedQuery($conversationId: ID!, $first: Int!) {
        allAiConversationMessages(
            conversationId: $conversationId
            orderBy: {createdAt: false}
            first: $first
        ) {
            edges {
                node {
                    id
                    role
                    content
                }
            }
        }
    }
`;

const LoadAiConversationRestricted: React.FC<LoadAiConversationRestrictedProps> = ({
    conversationId,
    onLoaded
}) => {
    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<LoadAiConversationRestrictedQuery> | null>(null);

    const queryParameters = useMemo(
        () => ({conversationId, first: REPLAYED_MESSAGES}),
        [conversationId]
    );

    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading) {
            queryRef?.load();
        }
    }, [queryParameters, queryRef?.hasPermission, queryRef?.load]);

    const edges = queryRef?.data?.allAiConversationMessages?.edges;

    useEffect(() => {
        if (!edges) {
            return;
        }

        const messages: ChatMessage[] = edges
            .map(({node}) => ({
                role: node.role as ChatMessage["role"],
                content: node.content ?? "",
            }))
            .filter((message) => message.content !== "")
            // Back to chronological order: the query returns newest-first to bound the slice.
            .reverse();

        onLoaded(messages);
    }, [edges, onLoaded]);

    return <LysQueryProvider query={ReplayQuery} parameters={queryParameters} ref={setQueryRef} />;
};

LoadAiConversationRestricted.displayName = "LoadAiConversationRestricted";

export default LoadAiConversationRestricted;
