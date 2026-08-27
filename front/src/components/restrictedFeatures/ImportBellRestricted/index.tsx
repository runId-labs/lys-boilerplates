import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {ImportBellRestrictedProps, ImportBellRestrictedRefInterface} from "./types";
import {useImportBellRestrictedTranslations} from "./translations";
import {useImportPanelDialog} from "./hooks";
import {useSignalSubscription} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useDebouncedCallback} from "@/hooks/useDebouncedCallback";
import type {ImportBellRestrictedQuery} from "./__generated__/ImportBellRestrictedQuery.graphql";
import "./styles.scss";

/**
 * GraphQL query for fetching active imports count
 */
const ActiveImportsCountQuery = graphql`
    query ImportBellRestrictedQuery {
        activeFileImportsCount {
            activeCount
        }
    }
`;

/**
 * A batch import fires one STARTED/COMPLETED/FAILED signal per file as the worker
 * processes them one by one — debounce the count refresh so a burst of signals costs
 * one query, not one per file.
 */
const ACTIVE_COUNT_DEBOUNCE_MS = 500;

/**
 * ImportBellRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected import tracker icon
 * - Active import count badge
 * - Real-time badge update via SSE signals (project-configured notification types)
 * - Opens import history panel on click
 */
const ImportBellRestricted = forwardRef<ImportBellRestrictedRefInterface, ImportBellRestrictedProps>(
    ({refreshNotificationTypes = []}, ref) => {
        const {t} = useImportBellRestrictedTranslations();

        const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ImportBellRestrictedQuery> | null>(null);
        const [activeCount, setActiveCount] = useState<number>(0);

        /**
         * Refresh the active count from the query
         */
        const refreshActiveCount = useCallback(() => {
            if (queryRef?.hasPermission) {
                queryRef.load();
            }
        }, [queryRef]);

        const debouncedRefreshActiveCount = useDebouncedCallback(refreshActiveCount, ACTIVE_COUNT_DEBOUNCE_MS);

        const {open: openImportPanel} = useImportPanelDialog();

        /**
         * Load initial active count when query is ready
         */
        useEffect(() => {
            if (queryRef?.hasPermission && !queryRef?.isLoading) {
                queryRef.load();
            }
        }, [queryRef?.hasPermission]);

        /**
         * Update local state when query data changes
         */
        useEffect(() => {
            if (queryRef?.data?.activeFileImportsCount) {
                setActiveCount(queryRef.data.activeFileImportsCount.activeCount);
            }
        }, [queryRef?.data]);

        /**
         * Refresh the badge when a notification of one of the configured types
         * arrives. The type list is project-supplied: lys defines no import
         * notification type.
         */
        useSignalSubscription((signal) => {
            if (
                signal.signal === "NEW_NOTIFICATION" &&
                typeof signal.params?.type_id === "string" &&
                refreshNotificationTypes.includes(signal.params.type_id)
            ) {
                debouncedRefreshActiveCount();
            }
        }, [debouncedRefreshActiveCount, refreshNotificationTypes]);

        useImperativeHandle(ref, () => ({
            hasPermission: !!queryRef?.hasPermission
        }), [queryRef?.hasPermission]);

        const badgeText = activeCount > 9 ? "9+" : String(activeCount);

        return (
            <LysQueryProvider
                query={ActiveImportsCountQuery}
                ref={setQueryRef}
            >
                {queryRef?.hasPermission && (
                    <div className="import-bell-restricted">
                        <button
                            type="button"
                            className="import-bell-button"
                            aria-label={t("imports")}
                            title={t("imports")}
                            onClick={openImportPanel}
                        >
                            <i className="bi bi-cloud-arrow-down"></i>
                            {activeCount > 0 && (
                                <span className="import-badge">
                                    {badgeText}
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </LysQueryProvider>
        );
    }
);

ImportBellRestricted.displayName = "ImportBellRestricted";

export default ImportBellRestricted;
