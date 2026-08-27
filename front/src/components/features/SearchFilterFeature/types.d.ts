import {FormSection} from "@/components/features/FormFeature/types";

/**
 * Sort option configuration
 */
export interface SortOption {
    /**
     * Sort field key (maps to GraphQL orderBy field)
     */
    key: string;

    /**
     * Display label for the sort option
     */
    label: string;
}

/**
 * Sort direction
 */
export type SortDirection = "ASC" | "DESC";

/**
 * Search filter configuration
 */
export interface SearchFilterConfig {
    /**
     * Enable quick search input
     * @default false
     */
    enableQuickSearch?: boolean;

    /**
     * URL parameter key for quick search
     * @default "search"
     */
    quickSearchParamKey?: string;

    /**
     * Placeholder text for quick search input
     */
    quickSearchPlaceholder?: string;

    /**
     * Debounce delay for quick search in milliseconds
     * @default 400
     */
    quickSearchDebounce?: number;

    /**
     * Sort options available
     */
    sortOptions: SortOption[];

    /**
     * Default sort field key
     */
    defaultSort?: string;

    /**
     * Default sort direction
     * @default "DESC"
     */
    defaultSortDirection?: SortDirection;

    /**
     * URL parameter key for orderBy
     * @default "orderBy"
     */
    orderByParamKey?: string;

    /**
     * URL parameter key for order direction
     * @default "orderDir"
     */
    orderDirParamKey?: string;

    /**
     * Advanced filter sections (optional)
     * Uses FormFeature sections format
     */
    filterSections?: FormSection[];
}

/**
 * Props for SearchFilterFeature component
 */
export interface SearchFilterFeatureProps extends SearchFilterConfig {
    /**
     * Callback when URL parameters change
     * Useful for triggering data refetch
     */
    onParametersChange?: (params: URLSearchParams) => void;

    /**
     * Actions to display below the active filters
     * Typically a ShowActionsFeature component
     * Will be rendered in a right-aligned container
     */
    actions?: React.ReactNode;

    /**
     * Children to render below the filter controls
     * Automatically wrapped in PageContainerElement for consistent spacing
     */
    children?: React.ReactNode;
}

/**
 * Active filter badge data
 */
export interface ActiveFilter {
    /**
     * URL parameter key
     */
    key: string;

    /**
     * Display label
     */
    label: string;

    /**
     * Display value
     */
    value: string;

    /**
     * Whether this is the sort filter (special styling)
     */
    isSort?: boolean;
}
