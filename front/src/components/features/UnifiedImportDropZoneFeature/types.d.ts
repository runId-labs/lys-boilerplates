/**
 * Per-file progress status while a dropped batch is uploaded one file at a time.
 */
export type ImportFileStatus = "uploading" | "success" | "duplicate" | "unrecognised" | "error";

/**
 * Outcome of uploading one file, as reported by the caller's onUploadFiles (one entry
 * per file, same order as the files passed in).
 */
export interface UnifiedImportUploadResult {
    success: boolean;
    /** Server-recognised file type, null when unrecognised. */
    detectedType: string | null;
    isDuplicate: boolean;
}

export interface ImportFileItem {
    key: string;
    file: File;
    /** Name of the immediate parent folder, when the file came from a dropped folder. */
    sourceFolder: string | null;
    status: ImportFileStatus;
    detectedType?: string | null;
}

export interface UnifiedImportDropZoneFeatureProps {
    /**
     * Upload every file of one drop in a single batch (the caller owns the actual
     * mutations). Resolves with one result per file, same order as passed in — the
     * whole batch is one round-trip, so status flips from "uploading" to final for
     * every file at once rather than progressively.
     */
    onUploadFiles: (files: File[]) => Promise<UnifiedImportUploadResult[]>;

    disabled?: boolean;

    /**
     * Maps a server-recognised file type to a translation key of this component's
     * translations, shown as the file's type badge (e.g. {INVOICE_FILE: "typeInvoice"}).
     * Unknown types fall back to the raw code.
     */
    typeLabelKeys?: Record<string, string>;
}
