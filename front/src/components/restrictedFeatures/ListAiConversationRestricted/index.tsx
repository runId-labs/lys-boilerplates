import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {
    LysQueryProvider,
    LysQueryRefInterface,
    LysMutationProvider,
    LysMutationRefInterface,
    useConnectedUserInfo,
} from "lys-front/providers";
import {ListAiConversationRestrictedProps} from "./types";
import {ListAiConversationRestrictedQuery} from "./__generated__/ListAiConversationRestrictedQuery.graphql";
import {useListAiConversationRestrictedTranslations} from "./translations";
import AiConversationListFeature from "@/components/features/AiConversationListFeature";
import {AiConversationItem} from "@/components/features/AiConversationListFeature/types";
import CheckboxElement from "@/components/elements/CheckboxElement";
import PaginationElement from "@/components/elements/PaginationElement";
import {RelayPageInfo} from "@/components/elements/PaginationElement/types";
import {useRelayPagination} from "lys-front/providers";

/**
 * ListAiConversationRestricted
 *
 * Dialog body opened from the chatbot header. Lists the connected user's own
 * conversations, newest first, paginated by 20. Scoping is server-side: the query runs
 * at OWNER access level, so it never needs to filter on the current user here.
 */
const PER_PAGE = 20;

const ListQuery = graphql`
    query ListAiConversationRestrictedQuery(
        $archived: Boolean
        $first: Int
        $after: String
        $last: Int
        $before: String
    ) {
        allAiConversations(
            archived: $archived
            orderBy: {createdAt: false}
            first: $first
            after: $after
            last: $last
            before: $before
        ) {
            pageInfo {
                totalCount
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node {
                    id
                    title
                    displayTitle
                    createdAt
                    archivedAt
                }
            }
        }
    }
`;

const RenameMutation = graphql`
    mutation ListAiConversationRestrictedRenameMutation(
        $id: ID!
        $inputs: UpdateAIConversationTitleInput!
    ) {
        updateAiConversationTitle(id: $id, inputs: $inputs) {
            id
            title
            displayTitle
        }
    }
`;

const ArchiveMutation = graphql`
    mutation ListAiConversationRestrictedArchiveMutation($id: ID!) {
        archiveAiConversation(id: $id) {
            id
            archivedAt
        }
    }
`;

const UnarchiveMutation = graphql`
    mutation ListAiConversationRestrictedUnarchiveMutation($id: ID!) {
        unarchiveAiConversation(id: $id) {
            id
            archivedAt
        }
    }
`;

const ListAiConversationRestricted: React.FC<ListAiConversationRestrictedProps> = ({
    onConversationSelected,
    activeConversationId
}) => {
    const {t} = useListAiConversationRestrictedTranslations();
    const {user} = useConnectedUserInfo();

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ListAiConversationRestrictedQuery> | null>(null);
    const [renameRef, setRenameRef] = useState<LysMutationRefInterface | null>(null);
    const [archiveRef, setArchiveRef] = useState<LysMutationRefInterface | null>(null);
    const [unarchiveRef, setUnarchiveRef] = useState<LysMutationRefInterface | null>(null);
    // Browsing the archive shows the archive alone: false lists the active conversations,
    // true lists only the archived ones.
    const [showArchive, setShowArchive] = useState(false);
    const {pageVars, resetToFirstPage, onPaginationChange} = useRelayPagination(PER_PAGE);

    const queryParameters = useMemo(
        () => ({archived: showArchive, ...pageVars}),
        [showArchive, pageVars]
    );

    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading) {
            queryRef?.load();
        }
    }, [queryParameters, queryRef?.hasPermission, queryRef?.load]);

    const data = queryRef?.data;

    const conversations = useMemo<AiConversationItem[]>(
        () => (data?.allAiConversations?.edges ?? []).map(({node}) => ({
            id: node.id,
            title: node.title ?? null,
            displayTitle: node.displayTitle ?? null,
            createdAt: node.createdAt,
            archivedAt: node.archivedAt ?? null,
        })),
        [data]
    );

    const pageInfo = (data?.allAiConversations?.pageInfo ?? null) as RelayPageInfo | null;

    // Both mutations are OWNER-only, where usePermissionCheck refuses access unless the
    // caller states whose rows these are. The listing is owner-scoped server-side, so the
    // conversations on screen belong to the connected user by construction.
    const accessParameters = useMemo(
        () => ({ownerIds: user?.id ? [user.id] : []}),
        [user?.id]
    );

    const reload = useCallback(() => queryRef?.load(), [queryRef]);

    const handleRename = useCallback((conversationId: string, title: string) => {
        renameRef?.commit?.({
            variables: {id: conversationId, inputs: {title}},
            onCompleted: reload,
        });
    }, [renameRef, reload]);

    const handleArchive = useCallback((conversationId: string) => {
        // Archiving drops the conversation out of the default listing, so the page it sat
        // on has to be read again rather than patched in place.
        archiveRef?.commit?.({
            variables: {id: conversationId},
            onCompleted: reload,
        });
    }, [archiveRef, reload]);

    const handleUnarchive = useCallback((conversationId: string) => {
        unarchiveRef?.commit?.({
            variables: {id: conversationId},
            onCompleted: reload,
        });
    }, [unarchiveRef, reload]);

    // Switching between the active list and the archive changes what the pages contain, so
    // the cursors held from the previous view no longer point anywhere meaningful.
    const handleShowArchiveChange = useCallback((checked: boolean) => {
        setShowArchive(checked);
        resetToFirstPage();
    }, [resetToFirstPage]);

    return (
        <LysQueryProvider query={ListQuery} parameters={queryParameters} ref={setQueryRef}>
            {/*
              * Mounted without children: LysMutationProvider renders nothing when the
              * webservice is out of reach, and the listing must stay readable even for a
              * user who cannot rename or archive.
              */}
            <LysMutationProvider
                mutation={RenameMutation}
                accessParameters={accessParameters}
                ref={setRenameRef}
            />
            <LysMutationProvider
                mutation={ArchiveMutation}
                accessParameters={accessParameters}
                ref={setArchiveRef}
            />
            <LysMutationProvider
                mutation={UnarchiveMutation}
                accessParameters={accessParameters}
                ref={setUnarchiveRef}
            />

            <CheckboxElement
                id="ai-conversation-show-archive"
                label={t("showArchive")}
                value={showArchive}
                onChange={handleShowArchiveChange}
                className="mb-2"
            />

            <AiConversationListFeature
                conversations={conversations}
                onSelect={onConversationSelected}
                activeConversationId={activeConversationId}
                onRename={renameRef?.commit ? handleRename : undefined}
                onArchive={archiveRef?.commit ? handleArchive : undefined}
                onUnarchive={unarchiveRef?.commit ? handleUnarchive : undefined}
            />

            {pageInfo && (pageInfo.totalCount ?? 0) > PER_PAGE && (
                <PaginationElement
                    pageInfo={pageInfo}
                    itemsPerPage={PER_PAGE}
                    currentItemCount={conversations.length}
                    onPaginationChange={onPaginationChange}
                    showItemsPerPage={false}
                    showItemCount={true}
                    align="end"
                    className="border-top-0 pt-3"
                />
            )}
        </LysQueryProvider>
    );
};

ListAiConversationRestricted.displayName = "ListAiConversationRestricted";

export default ListAiConversationRestricted;
