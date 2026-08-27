import React, {useCallback} from "react";
import BadgeElement from "@/components/elements/BadgeElement";
import ButtonElement from "@/components/elements/ButtonElement";
import {cn} from "lys-front/tools";
import {useActiveFilterBadgesElementTranslations} from "./translations";

export interface ActiveFilter {
    /**
     * Filter key identifier
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

interface ActiveFilterBadgesElementProps {
    /**
     * Active filters to display
     */
    filters: ActiveFilter[];

    /**
     * Label text displayed before badges
     */
    label?: string;

    /**
     * Clear all button text
     */
    clearAllText: string;

    /**
     * Custom CSS class
     */
    className?: string;

    /**
     * Callback when a filter is removed
     */
    onRemove: (key: string) => void;

    /**
     * Callback when all filters are cleared
     */
    onClearAll: () => void;
}

/**
 * ActiveFilterBadgesElement component
 *
 * Element component (Layer 1) - Pure UI for displaying active filter badges
 *
 * Features:
 * - Display of active filters as dismissible badges
 * - Clear all filters button
 * - Translation support for common values
 *
 * This is a pure Element (Layer 1) - no context hooks except translations.
 * URL synchronization is handled by the parent component via callbacks.
 */
const ActiveFilterBadgesElement: React.FC<ActiveFilterBadgesElementProps> = ({
    filters,
    label,
    clearAllText,
    className,
    onRemove,
    onClearAll
}) => {
    const {common} = useActiveFilterBadgesElementTranslations();

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Translate filter value if it exists in common translations
     * Returns the original value if no translation exists
     */
    const translateValue = useCallback(
        (value: string): string => {
            const translated = common(value as any);
            // If translation returns a key path (missing translation), use original value
            if (translated.startsWith("lys.")) {
                return value;
            }
            return translated;
        },
        [common]
    );

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (filters.length === 0) {
        return null;
    }

    return (
        <div className={cn("active-filter-badges-element d-flex align-items-center gap-2 flex-wrap", className)}>
            {label && <span className="text-muted">{label}</span>}

            {filters.map((filter) => (
                <BadgeElement
                    key={filter.key}
                    bg={filter.isSort ? "secondary" : "primary"}
                    className="d-flex align-items-center gap-2"
                >
                    <span style={{fontSize: "0.9rem"}}>
                        <strong>{filter.label}:</strong> {translateValue(filter.value)}
                    </span>
                    <i
                        className="bi bi-x-lg"
                        role="button"
                        onClick={() => onRemove(filter.key)}
                        style={{cursor: "pointer", fontSize: "0.8rem"}}
                        aria-label={`Remove filter ${filter.label}`}
                    />
                </BadgeElement>
            ))}

            {filters.length > 1 && (
                <ButtonElement
                    variant="link"
                    size="sm"
                    onClick={onClearAll}
                    className="text-decoration-none p-0"
                >
                    {clearAllText}
                </ButtonElement>
            )}
        </div>
    );
};

ActiveFilterBadgesElement.displayName = "ActiveFilterBadgesElement";

export default ActiveFilterBadgesElement;