import React, {useEffect, useMemo, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import ButtonElement from "@/components/elements/ButtonElement";
import {PaginationElementProps} from "./types";
import {usePaginationElementTranslations} from "./translations";
import "./styles.scss";

/**
 * PaginationElement component
 *
 * Element component (Layer 1) that provides:
 * - Relay cursor-based pagination controls
 * - Items per page selector
 * - Display of current range (X-Y of Total)
 * - Previous/Next navigation buttons
 *
 * This is an element component (Layer 1) that:
 * - Works with Relay GraphQL connections (pageInfo)
 * - Manages pagination state via callbacks
 * - Provides clear UX for professional applications
 * - Reusable across all paginated lists
 */
const PaginationElement: React.FC<PaginationElementProps> = ({
    pageInfo,
    itemsPerPage,
    itemsPerPageOptions = [10, 25, 50, 100],
    currentItemCount,
    onPaginationChange,
    className = "",
    align = "center",
    showItemsPerPage = true,
    showItemCount = true
}) => {
    const {t} = usePaginationElementTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    // 0-based index of the page currently shown. Display-only: navigation uses
    // canonical Relay cursors (first+after / last+before), the index just gives the
    // absolute "X-Y of N" range. Cursors stay opaque.
    const [pageIndex, setPageIndex] = useState(0);
    const lastStartCursor = useRef(pageInfo.startCursor);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    // Snap the index back to 0 only when the connection actually loads a fresh
    // first page (e.g. after a filter/search reload). We key on a real change of
    // startCursor so the stale window right after a "next" click — where pageInfo
    // still describes the previous page — does not wrongly reset the index.
    useEffect(() => {
        if (pageInfo.startCursor !== lastStartCursor.current) {
            lastStartCursor.current = pageInfo.startCursor;
            if (!pageInfo.hasPreviousPage) {
                setPageIndex(0);
            }
        }
    }, [pageInfo.startCursor, pageInfo.hasPreviousPage]);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Calculate current range (absolute start-end of total) from the page index.
     */
    const rangeInfo = useMemo(() => {
        const total = pageInfo.totalCount || 0;

        if (total === 0 || currentItemCount === 0) {
            return {start: 0, end: 0, total: 0};
        }

        const start = pageIndex * itemsPerPage + 1;
        const end = pageIndex * itemsPerPage + currentItemCount;

        return {start, end, total};
    }, [pageInfo.totalCount, currentItemCount, pageIndex, itemsPerPage]);

    /**
     * Format showing label with range values
     */
    const formattedShowingLabel = useMemo(() => {
        return t("showingRange")
            .replace("{start}", String(rangeInfo.start))
            .replace("{end}", String(rangeInfo.end))
            .replace("{total}", String(rangeInfo.total));
    }, [t, rangeInfo]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle previous page — canonical Relay backward pagination (last + before).
     */
    const handlePrevious = () => {
        if (!pageInfo.hasPreviousPage) return;

        setPageIndex(p => Math.max(0, p - 1));
        onPaginationChange({
            first: null,
            last: itemsPerPage,
            before: pageInfo.startCursor,
            after: null
        });
    };

    /**
     * Handle next page — forward pagination (first + after).
     */
    const handleNext = () => {
        if (!pageInfo.hasNextPage) return;

        setPageIndex(p => p + 1);
        onPaginationChange({
            first: itemsPerPage,
            last: null,
            after: pageInfo.endCursor,
            before: null
        });
    };

    /**
     * Handle items per page change — reset to the first page.
     */
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value, 10);

        setPageIndex(0);
        onPaginationChange({
            first: newItemsPerPage,
            last: null,
            after: null,
            before: null
        });
    };

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    // Don't render if no data
    if (!pageInfo.totalCount || pageInfo.totalCount === 0) {
        return null;
    }

    const alignClass = align === "center" ? "justify-content-center" : align === "end" ? "justify-content-end" : "justify-content-start";

    return (
        <div className={`pagination-element d-flex align-items-center gap-3 ${alignClass} ${className}`}>
            {/* Items per page selector */}
            {showItemsPerPage && (
                <div className="d-flex align-items-center gap-2">
                    <label className="mb-0 text-muted small">
                        {t("itemsPerPage")}
                    </label>
                    <Form.Select
                        size="sm"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="items-per-page-select"
                    >
                        {itemsPerPageOptions.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            )}

            {/* Showing X-Y of Total */}
            {showItemCount && (
                <div className="text-muted small">
                    {formattedShowingLabel}
                </div>
            )}

            {/* Navigation buttons */}
            <div className="pagination-buttons d-flex gap-2">
                <ButtonElement
                    variant="outline-secondary"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={!pageInfo.hasPreviousPage}
                    leftIcon={<i className="bi bi-chevron-left"></i>}
                >
                    {t("previous")}
                </ButtonElement>

                <ButtonElement
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleNext}
                    disabled={!pageInfo.hasNextPage}
                    rightIcon={<i className="bi bi-chevron-right"></i>}
                >
                    {t("next")}
                </ButtonElement>
            </div>
        </div>
    );
};

PaginationElement.displayName = "PaginationElement";

export default PaginationElement;
