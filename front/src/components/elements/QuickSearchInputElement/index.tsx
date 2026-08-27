import React, {useCallback, useEffect, useState} from "react";
import {Form, InputGroup} from "react-bootstrap";
import {cn} from "lys-front/tools";
import {useQuickSearchInputElementTranslations} from "./translations";

interface QuickSearchInputElementProps {
    /**
     * Current search value
     */
    value: string;

    /**
     * Callback when search value changes (after debounce)
     */
    onChange: (value: string) => void;

    /**
     * Placeholder text
     */
    placeholder: string;

    /**
     * Debounce delay in milliseconds
     */
    debounce?: number;

    /**
     * Custom CSS class
     */
    className?: string;
}

/**
 * QuickSearchInputElement component
 *
 * Element component (Layer 1) - Pure UI search input with debounce
 *
 * Features:
 * - Debounced input changes
 * - Clear button when value present
 * - Search icon
 *
 * This is a pure Element (Layer 1) - no context hooks.
 * URL synchronization is handled by the parent component.
 */
const QuickSearchInputElement: React.FC<QuickSearchInputElementProps> = ({
    value,
    onChange,
    placeholder,
    debounce = 400,
    className
}) => {
    const [localValue, setLocalValue] = useState<string>(value);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const {t} = useQuickSearchInputElementTranslations();

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Sync local value with prop value
     */
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    /**
     * Cleanup timeout on unmount
     */
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle input change with debounce
     */
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setLocalValue(newValue);

            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set new timeout for onChange callback
            const newTimeoutId = setTimeout(() => {
                onChange(newValue.trim());
            }, debounce);

            setTimeoutId(newTimeoutId);
        },
        [debounce, timeoutId, onChange]
    );

    /**
     * Clear search input
     */
    const handleClear = useCallback(() => {
        setLocalValue("");
        onChange("");
    }, [onChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <InputGroup className={cn("quick-search-input-element", className)}>
            <InputGroup.Text>
                <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={handleChange}
                aria-label={t("quickSearchAriaLabel")}
            />
            {localValue && (
                <InputGroup.Text
                    role="button"
                    onClick={handleClear}
                    style={{cursor: "pointer"}}
                    aria-label={t("clearSearchAriaLabel")}
                >
                    <i className="bi bi-x-lg" />
                </InputGroup.Text>
            )}
        </InputGroup>
    );
};

QuickSearchInputElement.displayName = "QuickSearchInputElement";

export default QuickSearchInputElement;