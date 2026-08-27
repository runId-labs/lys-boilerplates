import { DroppedFile, FileDropResult } from "./types";

/**
 * Read one directory entry one level deep: its files, plus a count of any nested
 * subfolders found (skipped — no recursion). readEntries() only returns a batch at a
 * time per spec, so it's called repeatedly until it returns empty.
 */
function readDirectoryEntry(dirEntry: FileSystemDirectoryEntry): Promise<{ files: File[]; skippedFolders: number }> {
    return new Promise((resolve) => {
        const reader = dirEntry.createReader();
        const files: File[] = [];
        let skippedFolders = 0;

        const readBatch = () => {
            reader.readEntries((entries) => {
                if (entries.length === 0) {
                    resolve({ files, skippedFolders });
                    return;
                }

                const entryFiles = entries.filter((entry): entry is FileSystemFileEntry => entry.isFile);
                skippedFolders += entries.length - entryFiles.length;

                Promise.all(
                    entryFiles.map((entry) => new Promise<File | null>((res) => entry.file(res, () => res(null))))
                ).then((resolved) => {
                    files.push(...resolved.filter((f): f is File => f !== null));
                    readBatch();
                });
            }, () => resolve({ files, skippedFolders }));
        };

        readBatch();
    });
}

/**
 * Resolve a drop's DataTransferItemList into files, expanding any dropped folder one
 * level deep (its files; nested subfolders are counted, not descended into).
 *
 * webkitGetAsEntry() must be called synchronously on each DataTransferItem before any
 * await — the items become invalid once the drop event handler yields. The resulting
 * FileSystemEntry objects stay valid for the async directory reads that follow.
 */
export async function resolveDataTransferItems(items: DataTransferItemList): Promise<FileDropResult> {
    const entries = Array.from(items)
        .map((item) => item.webkitGetAsEntry?.())
        .filter((entry): entry is FileSystemEntry => !!entry);

    const droppedFiles: DroppedFile[] = [];
    let ignoredSubfolderCount = 0;

    for (const entry of entries) {
        if (entry.isFile) {
            const file = await new Promise<File | null>((res) =>
                (entry as FileSystemFileEntry).file(res, () => res(null))
            );
            if (file) droppedFiles.push({ file, sourceFolder: null });
        } else if (entry.isDirectory) {
            const { files, skippedFolders } = await readDirectoryEntry(entry as FileSystemDirectoryEntry);
            files.forEach((file) => droppedFiles.push({ file, sourceFolder: entry.name }));
            ignoredSubfolderCount += skippedFolders;
        }
    }

    return { files: droppedFiles, ignoredSubfolderCount };
}
