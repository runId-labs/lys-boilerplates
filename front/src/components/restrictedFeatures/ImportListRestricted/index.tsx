import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {useIntl} from "react-intl";
import {LysQueryProvider, LysQueryRefInterface, useSignalSubscription} from "lys-front/providers";
import {useDebouncedCallback} from "@/hooks/useDebouncedCallback";
import {useImportListRestrictedTranslations} from "./translations";
import {ImportListRestrictedProps} from "./types";
import type {ImportListRestrictedQuery} from "./__generated__/ImportListRestrictedQuery.graphql";
import "./styles.scss";

const PAGE_SIZE = 15;

/**
 * A batch import fires one STARTED/COMPLETED/FAILED signal per file as the worker
 * processes them one by one — debounce the list refresh so a burst of signals costs
 * one reload, not one per file.
 */
const REFRESH_DEBOUNCE_MS = 500;

/**
 * GraphQL query for paginated file imports
 */
const FileImportsQuery = graphql`
    query ImportListRestrictedQuery(
        $first: Int
        $after: String
    ) {
        allFileImports(
            first: $first
            after: $after
            orderBy: {createdAt: false}
        ) {
            edges {
                node {
                    id
                    statusId
                    typeId
                    totalRows
                    processedRows
                    successRows
                    errorRows
                    startedAt
                    completedAt
                    createdAt
                    extraData
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

interface ImportItem {
    id: string;
    statusId: string;
    typeId: string;
    totalRows: number | null;
    processedRows: number | null;
    successRows: number | null;
    errorRows: number | null;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    label: string;
}

const STATUS_LABELS: Record<string, "pending" | "processing" | "completed" | "failed" | "cancelled"> = {
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    FAILED: "failed",
    CANCELLED: "cancelled",
};

/**
 * Build a human-readable label: prefer the original file name recorded by the
 * backend, fall back to the raw import type code.
 */
const buildImportLabel = (typeId: string, extraData: Record<string, unknown> | null): string => {
    const fileName = extraData?.original_file_name as string | undefined;
    return fileName || typeId;
};

/**
 * ImportListRestricted component
 *
 * Displays a paginated list of file imports with:
 * - Status indicator (colored dot)
 * - File name and type badge
 * - Row statistics
 * - Relative time display
 */
const ImportListRestricted: React.FC<ImportListRestrictedProps> = ({typeLabelKeys = {}, refreshNotificationTypes = []}) => {
    const {t} = useImportListRestrictedTranslations();
    const intl = useIntl();

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ImportListRestrictedQuery> | null>(null);
    const [items, setItems] = useState<ImportItem[]>([]);
    const [endCursor, setEndCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentCursor, setCurrentCursor] = useState<string | null>(null);

    const queryParameters = useMemo(() => ({
        first: PAGE_SIZE,
        after: currentCursor,
    }), [currentCursor]);

    /**
     * Parse query response into items
     */
    useEffect(() => {
        if (!queryRef?.data?.allFileImports) return;
        const response = queryRef.data.allFileImports;
        const newItems: ImportItem[] = response.edges.map((edge) => ({
            id: edge.node.id,
            statusId: edge.node.statusId,
            typeId: edge.node.typeId,
            totalRows: edge.node.totalRows ?? null,
            processedRows: edge.node.processedRows ?? null,
            successRows: edge.node.successRows ?? null,
            errorRows: edge.node.errorRows ?? null,
            startedAt: edge.node.startedAt ?? null,
            completedAt: edge.node.completedAt ?? null,
            createdAt: edge.node.createdAt,
            label: buildImportLabel(edge.node.typeId, edge.node.extraData as Record<string, unknown> | null),
        }));

        const sortFn = (a: ImportItem, b: ImportItem) => {
            const dateCompare = b.createdAt.localeCompare(a.createdAt);
            if (dateCompare !== 0) return dateCompare;
            return a.label.localeCompare(b.label);
        };

        if (isLoadingMore) {
            setItems(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const uniqueNew = newItems.filter(item => !existingIds.has(item.id));
                return [...prev, ...uniqueNew].sort(sortFn);
            });
            setIsLoadingMore(false);
        } else {
            setItems([...newItems].sort(sortFn));
        }

        setEndCursor(response.pageInfo.endCursor ?? null);
        setHasNextPage(response.pageInfo.hasNextPage);
    }, [queryRef?.data]);

    /**
     * Initial load
     */
    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
            queryRef.load();
        }
    }, [queryRef?.hasPermission]);

    /**
     * Reload when cursor changes (pagination)
     */
    useEffect(() => {
        if (currentCursor && queryRef?.hasPermission) {
            queryRef.load();
        }
    }, [currentCursor]);

    /**
     * Load more imports
     */
    const handleLoadMore = useCallback(() => {
        if (!endCursor || isLoadingMore) return;
        setIsLoadingMore(true);
        setCurrentCursor(endCursor);
    }, [endCursor, isLoadingMore]);

    /**
     * Refresh list when an import starts, completes, or fails. Debounced — see
     * REFRESH_DEBOUNCE_MS.
     */
    const debouncedRefreshList = useDebouncedCallback(() => {
        setCurrentCursor(null);
        setIsLoadingMore(false);
        if (queryRef?.hasPermission) {
            queryRef.load();
        }
    }, REFRESH_DEBOUNCE_MS);

    // Refresh when a notification of one of the configured types arrives (debounced).
    // The type list is project-supplied: lys defines no import notification type.
    useSignalSubscription((signal) => {
        if (
            signal.signal === "NEW_NOTIFICATION" &&
            typeof signal.params?.type_id === "string" &&
            refreshNotificationTypes.includes(signal.params.type_id)
        ) {
            debouncedRefreshList();
        }
    }, [debouncedRefreshList, refreshNotificationTypes]);

    /**
     * Format time
     */
    const formatTime = useCallback((dateString: string) => {
        return intl.formatDate(dateString, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }, [intl]);

    /**
     * Format row stats
     */
    const formatStats = useCallback((item: ImportItem): string | null => {
        if (item.totalRows === null) return null;
        const parts: string[] = [];
        if (item.successRows !== null && item.totalRows !== null) {
            parts.push(t("rows", {values: {success: String(item.successRows), total: String(item.totalRows)}}));
        }
        if (item.errorRows && item.errorRows > 0) {
            parts.push(t("errors", {values: {count: String(item.errorRows)}}));
        }
        return parts.join(" — ");
    }, [t]);

    return (
        <LysQueryProvider
            query={FileImportsQuery}
            parameters={queryParameters}
            options={{fetchPolicy: "network-only"}}
            ref={setQueryRef}
        >
            <div className="import-list">
                {items.length === 0 && !queryRef?.isLoading && (
                    <div className="import-list__empty">
                        {t("noImports")}
                    </div>
                )}

                {queryRef?.isLoading && items.length === 0 && (
                    <div className="import-list__loading">
                        <div className="spinner-border spinner-border-sm" role="status" />
                    </div>
                )}

                {items.length > 0 && (
                    <ul className="import-list__items">
                        {items.map((item) => {
                            const statusKey = STATUS_LABELS[item.statusId] || "pending";
                            const typeKey = typeLabelKeys[item.typeId];
                            const stats = formatStats(item);

                            return (
                                <li key={item.id} className="import-list__item">
                                    <span className={`import-list__status-dot import-list__status-dot--${statusKey}`} />
                                    <div className="import-list__content">
                                        <div className="import-list__header">
                                            <span className="import-list__file-name">
                                                {item.label}
                                            </span>
                                            <span className="import-list__type-badge">
                                                {typeKey ? t(typeKey as Parameters<typeof t>[0]) : item.typeId}
                                            </span>
                                        </div>
                                        <div className="import-list__meta">
                                            {t(statusKey)}
                                            {stats && ` — ${stats}`}
                                            {" — "}
                                            {formatTime(item.createdAt)}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {hasNextPage && (
                    <div className="import-list__load-more">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore && (
                                <span className="spinner-border spinner-border-sm me-1" role="status" />
                            )}
                            {t("loadMore")}
                        </button>
                    </div>
                )}
            </div>
        </LysQueryProvider>
    );
};

ImportListRestricted.displayName = "ImportListRestricted";

export default ImportListRestricted;
