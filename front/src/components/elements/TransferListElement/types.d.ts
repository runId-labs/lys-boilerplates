/**
 * Single item in the transfer list
 */
export interface TransferItem {
    id: string;
    label: string;
    subtitle?: string;
}

/**
 * TransferListElement props
 */
export interface TransferListElementProps {
    /**
     * Items in the source (left) column
     */
    sourceItems: TransferItem[];

    /**
     * Items in the target (right) column
     */
    targetItems: TransferItem[];

    /**
     * Called when an item is moved from source to target (left to right)
     */
    onTransferToTarget: (itemId: string) => void;

    /**
     * Called when an item is moved from target to source (right to left)
     */
    onTransferToSource: (itemId: string) => void;

    /**
     * Title for the source column
     */
    sourceTitle?: string;

    /**
     * Title for the target column
     */
    targetTitle?: string;

    /**
     * Placeholder text for the search input
     */
    searchPlaceholder?: string;

    /**
     * Current search value
     */
    searchValue: string;

    /**
     * Search input change handler
     */
    onSearchChange: (value: string) => void;

    /**
     * Whether source items are loading
     */
    isSourceLoading?: boolean;

    /**
     * Whether a mutation is in progress (disables DnD)
     */
    isMutating?: boolean;

    /**
     * Message when source column is empty
     */
    emptySourceMessage?: string;

    /**
     * Message when target column is empty
     */
    emptyTargetMessage?: string;

    /**
     * Callback to load more source items (pagination)
     */
    onLoadMore?: () => void;

    /**
     * Whether more source items are available
     */
    hasMoreSource?: boolean;

    /**
     * Label for the load more button
     */
    loadMoreLabel?: string;

    /**
     * Optional CSS class
     */
    className?: string;
}
