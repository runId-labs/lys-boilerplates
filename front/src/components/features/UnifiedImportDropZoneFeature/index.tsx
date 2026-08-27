import React, {useCallback, useMemo, useRef, useState} from "react";
import {Collapse} from "react-bootstrap";
import FileDropZoneElement from "@/components/elements/FileDropZoneElement";
import {FileDropResult} from "@/components/elements/FileDropZoneElement/types";
import {ImportFileItem, ImportFileStatus, UnifiedImportDropZoneFeatureProps} from "./types";
import {useUnifiedImportDropZoneFeatureTranslations} from "./translations";
import "./styles.scss";

const STATUS_ICON: Record<ImportFileStatus, string> = {
    uploading: "",
    success: "bi-check-circle-fill text-success",
    duplicate: "bi-info-circle-fill text-info",
    unrecognised: "bi-exclamation-triangle-fill text-warning",
    error: "bi-x-circle-fill text-danger",
};

/**
 * Files of one drop are sent in chunks of this size, not all at once. A large
 * onboarding drop can easily reach 75-100+ files — one request
 * that large risks a timeout in confirmImportUploads (it downloads and hashes every
 * file server-side, sequentially) and, if it fails, loses every result, not just the
 * files still pending. Chunking bounds a failure to one chunk and lets the list fill in
 * progressively instead of staying frozen until the whole drop is done.
 */
const CHUNK_SIZE = 50;

/**
 * UnifiedImportDropZoneFeature component
 *
 * Feature component (Layer 2): owns the dropped-files list and their upload status.
 * Regenerated on every drop (no accumulation across drops — import history is a
 * separate component). Files are sent in chunks of CHUNK_SIZE — the actual mutations
 * live in the caller's onUploadFiles (a restricted feature) — so status flips from
 * "uploading" to final chunk by chunk rather than file by file or all at once.
 *
 * The drop zone is disabled for the whole duration of a batch's upload (not just
 * per-chunk): a second drop landing mid-upload would silently orphan the first
 * batch's remaining chunks from the visible list (still uploading, just no longer
 * shown) — batchRef stays as a defense-in-depth guard, not the primary safeguard.
 *
 * The file list sits behind a collapsed-by-default summary header (counts only —
 * in progress / imported / error or unrecognised) rather than an always-open flat
 * list: at the volumes this feature targets (75-100+ files) a flat list is not
 * usable. Deliberately closed even when there are errors — once opened, the list
 * itself defaults to an "attention" filter (error/unrecognised only, see
 * showAttentionOnly) instead of pagination: the real need at this volume is
 * triaging failures, not paging through successes.
 */
const UnifiedImportDropZoneFeature: React.FC<UnifiedImportDropZoneFeatureProps> = ({onUploadFiles, disabled, typeLabelKeys = {}}) => {
    const {t} = useUnifiedImportDropZoneFeatureTranslations();
    const [items, setItems] = useState<ImportFileItem[]>([]);
    const [ignoredSubfolderCount, setIgnoredSubfolderCount] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    // Closed by default (see component docstring) — not reset across drops, so a user
    // who opened it once keeps it open for the next batch too.
    const [isListOpen, setIsListOpen] = useState(false);
    // Checked by default: the list opens straight to what needs review, not a wall of
    // successes. Not reset across drops, same reasoning as isListOpen.
    const [showAttentionOnly, setShowAttentionOnly] = useState(true);
    // Guards against a stale batch's async results overwriting a newer drop's list.
    const batchRef = useRef(0);

    const handleFilesDropped = useCallback(({files: dropped, ignoredSubfolderCount: skippedCount}: FileDropResult) => {
        const batch = ++batchRef.current;
        setIgnoredSubfolderCount(skippedCount);
        const batchItems: ImportFileItem[] = dropped.map(({file, sourceFolder}, index) => ({
            key: `${batch}-${index}-${file.name}`,
            file,
            sourceFolder,
            status: "uploading",
        }));
        setItems(batchItems);

        if (dropped.length === 0) return;
        const files = dropped.map(({file}) => file);

        (async () => {
            setIsUploading(true);
            try {
                for (let start = 0; start < files.length; start += CHUNK_SIZE) {
                    const chunk = files.slice(start, start + CHUNK_SIZE);
                    const results = await onUploadFiles(chunk);
                    if (batchRef.current !== batch) return;

                    setItems((prev) => prev.map((item, index) => {
                        if (index < start || index >= start + chunk.length) return item;
                        const result = results[index - start];
                        const status: ImportFileStatus = !result.success
                            ? "error"
                            : result.isDuplicate
                                ? "duplicate"
                                : result.detectedType === null
                                    ? "unrecognised"
                                    : "success";
                        return {...item, status, detectedType: result.detectedType};
                    }));
                }
            } finally {
                if (batchRef.current === batch) setIsUploading(false);
            }
        })();
    }, [onUploadFiles]);

    const counts = useMemo(() => {
        let uploadingCount = 0;
        let successCount = 0;
        let warningCount = 0;
        for (const item of items) {
            if (item.status === "uploading") uploadingCount += 1;
            else if (item.status === "success" || item.status === "duplicate") successCount += 1;
            else warningCount += 1; // "error" | "unrecognised"
        }
        return {uploading: uploadingCount, success: successCount, warning: warningCount};
    }, [items]);

    const visibleItems = useMemo(() => (
        showAttentionOnly
            ? items.filter((item) => item.status === "error" || item.status === "unrecognised")
            : items
    ), [items, showAttentionOnly]);

    const statusLabel = useCallback((item: ImportFileItem): string => {
        if (item.status === "success" && item.detectedType) {
            const typeKey = item.detectedType ? typeLabelKeys[item.detectedType] : undefined;
            if (typeKey) return t(typeKey as Parameters<typeof t>[0]);
        }
        const key = `status${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}` as
            "statusUploading" | "statusSuccess" | "statusDuplicate" | "statusUnrecognised" | "statusError";
        return t(key);
    }, [t, typeLabelKeys]);

    return (
        <div className="unified-import-drop-zone-feature">
            <FileDropZoneElement
                onFilesDropped={handleFilesDropped}
                disabled={disabled || isUploading}
                loading={isUploading}
                dropZoneLabel={isUploading ? t("uploadingLabel") : t("dropZoneLabel")}
                helperText={isUploading ? undefined : t("helperText")}
            />

            {ignoredSubfolderCount > 0 && (
                <div className="unified-import-drop-zone-feature__notice">
                    <i className="bi bi-info-circle me-1" aria-hidden="true" />
                    {t("subfoldersIgnored", {values: {count: String(ignoredSubfolderCount)}})}
                </div>
            )}

            {items.length > 0 && (
                <div className="unified-import-drop-zone-feature__results">
                    <button
                        type="button"
                        className="unified-import-drop-zone-feature__summary"
                        onClick={() => setIsListOpen((open) => !open)}
                        aria-expanded={isListOpen}
                        aria-label={t("summaryToggleAriaLabel")}
                    >
                        <i className={`bi ${isListOpen ? "bi-chevron-up" : "bi-chevron-down"}`} aria-hidden="true" />
                        {counts.uploading > 0 && (
                            <span className="unified-import-drop-zone-feature__summary-count">
                                {t("summaryUploading", {values: {count: String(counts.uploading)}})}
                            </span>
                        )}
                        {counts.success > 0 && (
                            <span className="unified-import-drop-zone-feature__summary-count unified-import-drop-zone-feature__summary-count--success">
                                {t("summarySuccess", {values: {count: String(counts.success)}})}
                            </span>
                        )}
                        {counts.warning > 0 && (
                            <span className="unified-import-drop-zone-feature__summary-count unified-import-drop-zone-feature__summary-count--warning">
                                {t("summaryWarning", {values: {count: String(counts.warning)}})}
                            </span>
                        )}
                    </button>

                    <Collapse in={isListOpen}>
                        <div>
                            <div className="unified-import-drop-zone-feature__filter form-check">
                                <input
                                    type="checkbox"
                                    id="unified-import-attention-filter"
                                    className="form-check-input"
                                    checked={showAttentionOnly}
                                    onChange={(e) => setShowAttentionOnly(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="unified-import-attention-filter">
                                    {t("attentionFilterLabel")}
                                </label>
                            </div>

                            {visibleItems.length > 0 ? (
                                <ul className="unified-import-drop-zone-feature__list" aria-label={t("selectedFilesAriaLabel")}>
                                    {visibleItems.map((item) => (
                                        <li key={item.key} className="unified-import-drop-zone-feature__item">
                                            {item.status === "uploading"
                                                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                : <i className={`bi ${STATUS_ICON[item.status]}`} aria-hidden="true" />}
                                            <span className="unified-import-drop-zone-feature__name">
                                                {item.sourceFolder ? `${item.sourceFolder}/${item.file.name}` : item.file.name}
                                            </span>
                                            <span className="unified-import-drop-zone-feature__status">{statusLabel(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="unified-import-drop-zone-feature__empty">
                                    <i className="bi bi-check-circle text-success me-1" aria-hidden="true" />
                                    {t("emptyAttentionMessage")}
                                </div>
                            )}
                        </div>
                    </Collapse>
                </div>
            )}
        </div>
    );
};

UnifiedImportDropZoneFeature.displayName = "UnifiedImportDropZoneFeature";

export default UnifiedImportDropZoneFeature;
