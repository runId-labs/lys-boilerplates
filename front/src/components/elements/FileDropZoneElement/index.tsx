import React, { useCallback, useRef, useState } from "react";
import { FileDropZoneElementProps } from "./types";
import { resolveDataTransferItems } from "./utils";
import { useFileDropZoneElementTranslations } from "./translations";
import { cn } from "lys-front/tools";
import "./styles.scss";

/**
 * FileDropZoneElement component
 *
 * Pure drag-and-drop surface: reports the files from each drop or click-to-browse
 * selection via onFilesDropped. No file list, no accumulation, no upload — that's
 * the caller's business logic.
 *
 * A dropped folder is expanded one level deep (its files only — nested subfolders are
 * skipped, not recursed into: the destination here is a flat list of documents, not a
 * folder tree, so there is nothing to gain from descending further, only unpredictable
 * volume). Falls back to the flat file list when the browser has no FileSystemEntry
 * support (webkitGetAsEntry undefined) — folders then behave as before (ignored by
 * dataTransfer.files).
 */
const FileDropZoneElement: React.FC<FileDropZoneElementProps> = ({
    onFilesDropped,
    disabled = false,
    loading = false,
    dropZoneLabel,
    helperText,
    className,
}) => {
    const {t} = useFileDropZoneElementTranslations();

    const resolvedDropZoneLabel = dropZoneLabel ?? t("dropZoneLabel");

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Folder resolution is async and takes a variable amount of time, so two rapid
    // interactions (drop then drop, or drop then click-select) can resolve out of order
    // relative to when they happened. Every interaction bumps this counter synchronously;
    // an async resolution that finishes after a newer interaction started is discarded —
    // only the most recently *started* interaction is ever reported, matching the
    // synchronous (order-guaranteed) behavior of the plain-file-list path.
    const interactionRef = useRef(0);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (disabled) return;

            const interaction = ++interactionRef.current;
            const items = e.dataTransfer.items;
            const supportsEntries = items && items.length > 0 && !!items[0].webkitGetAsEntry;

            if (supportsEntries) {
                resolveDataTransferItems(items).then((result) => {
                    if (interactionRef.current !== interaction) return; // superseded
                    if (result.files.length > 0 || result.ignoredSubfolderCount > 0) {
                        onFilesDropped(result);
                    }
                });
                return;
            }

            const droppedFiles = e.dataTransfer.files;
            if (droppedFiles.length > 0) {
                onFilesDropped({
                    files: Array.from(droppedFiles).map((file) => ({ file, sourceFolder: null })),
                    ignoredSubfolderCount: 0,
                });
            }
        },
        [disabled, onFilesDropped]
    );

    const handleClick = useCallback(() => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [disabled]);

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                interactionRef.current += 1; // supersede any folder resolution still in flight
                onFilesDropped({
                    files: Array.from(e.target.files).map((file) => ({ file, sourceFolder: null })),
                    ignoredSubfolderCount: 0,
                });
                // Reset input to allow selecting the same file again
                e.target.value = "";
            }
        },
        [onFilesDropped]
    );

    return (
        <div className={cn("file-drop-zone-element", className)}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="d-none"
                disabled={disabled}
                aria-hidden="true"
            />

            {/* Drop zone */}
            <div
                className={cn(
                    "drop-zone",
                    isDragging && "drop-zone--dragging",
                    disabled && "drop-zone--disabled",
                    loading && "drop-zone--loading"
                )}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                aria-label={resolvedDropZoneLabel}
                aria-disabled={disabled}
            >
                {loading
                    ? <span className="spinner-border drop-zone__spinner" role="status" aria-hidden="true" />
                    : <i className="bi bi-cloud-arrow-up drop-zone__icon" aria-hidden="true" />}
                <span className="drop-zone__label">{resolvedDropZoneLabel}</span>
                {helperText && <span className="drop-zone__helper">{helperText}</span>}
            </div>
        </div>
    );
};

FileDropZoneElement.displayName = "FileDropZoneElement";

export default FileDropZoneElement;
