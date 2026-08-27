/**
 * One resolved file from a drop or file-picker selection.
 */
export interface DroppedFile {
    file: File;
    /** Name of the immediate parent folder, when the file came from a dropped folder. */
    sourceFolder: string | null;
}

/**
 * Outcome of resolving one drop or file-picker selection.
 */
export interface FileDropResult {
    files: DroppedFile[];
    /**
     * Subfolders found one level below a dropped folder — not descended into (no
     * recursion), just counted so the caller can tell the user some were skipped.
     */
    ignoredSubfolderCount: number;
}

export interface FileDropZoneElementProps {
    /**
     * Called with the outcome of a single drop or file-picker selection.
     * No accumulation across interactions — one call per drop/selection.
     */
    onFilesDropped: (result: FileDropResult) => void;

    /**
     * Whether the component is disabled
     */
    disabled?: boolean;

    /**
     * Shows a spinner instead of the drop icon (e.g. while a previous drop is still
     * uploading). Purely visual — the caller is responsible for also passing
     * `disabled` if drops should be rejected during this state.
     */
    loading?: boolean;

    /**
     * Label for the drop zone area
     */
    dropZoneLabel?: string;

    /**
     * Helper text shown below the drop zone
     */
    helperText?: string;

    /**
     * Additional CSS class name
     */
    className?: string;
}
