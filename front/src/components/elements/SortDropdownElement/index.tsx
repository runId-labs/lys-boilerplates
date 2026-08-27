import React, {useCallback} from "react";
import {Form, InputGroup} from "react-bootstrap";
import {cn} from "lys-front/tools";
import {useSortDropdownElementTranslations} from "./translations";

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

export type SortDirection = "ASC" | "DESC";

interface SortDropdownElementProps {
    /**
     * Available sort options
     */
    sortOptions: SortOption[];

    /**
     * Current sort field value
     */
    sortField: string;

    /**
     * Current sort direction
     */
    sortDirection: SortDirection;

    /**
     * Callback when sort field changes
     */
    onSortFieldChange: (field: string) => void;

    /**
     * Callback when sort direction changes
     */
    onSortDirectionChange: (direction: SortDirection) => void;

    /**
     * Label for sort dropdown
     */
    label: string;

    /**
     * Ascending label
     */
    ascendingLabel: string;

    /**
     * Descending label
     */
    descendingLabel: string;

    /**
     * Custom CSS class
     */
    className?: string;
}

/**
 * SortDropdownElement component
 *
 * Element component (Layer 1) - Pure UI for sort field and direction selection
 *
 * Features:
 * - Sort field selection dropdown
 * - Sort direction toggle button
 *
 * This is a pure Element (Layer 1) - no context hooks.
 * URL synchronization is handled by the parent component via callbacks.
 */
const SortDropdownElement: React.FC<SortDropdownElementProps> = ({
    sortOptions,
    sortField,
    sortDirection,
    onSortFieldChange,
    onSortDirectionChange,
    label,
    ascendingLabel,
    descendingLabel,
    className
}) => {
    const {t} = useSortDropdownElementTranslations();

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle sort field change
     */
    const handleFieldChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onSortFieldChange(e.target.value);
        },
        [onSortFieldChange]
    );

    /**
     * Toggle sort direction
     */
    const handleDirectionToggle = useCallback(() => {
        const newDirection: SortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
        onSortDirectionChange(newDirection);
    }, [sortDirection, onSortDirectionChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <InputGroup className={cn("sort-dropdown-element", className)}>
            <InputGroup.Text>{label}</InputGroup.Text>
            <Form.Select
                value={sortField}
                onChange={handleFieldChange}
                aria-label={t("sortFieldAriaLabel")}
            >
                {sortOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.label}
                    </option>
                ))}
            </Form.Select>
            <InputGroup.Text
                role="button"
                onClick={handleDirectionToggle}
                style={{cursor: "pointer"}}
                aria-label={`Sort direction: ${sortDirection === "ASC" ? ascendingLabel : descendingLabel}`}
                title={sortDirection === "ASC" ? ascendingLabel : descendingLabel}
            >
                <i className={`bi bi-sort-${sortDirection === "ASC" ? "up" : "down"}`} />
            </InputGroup.Text>
        </InputGroup>
    );
};

SortDropdownElement.displayName = "SortDropdownElement";

export default SortDropdownElement;