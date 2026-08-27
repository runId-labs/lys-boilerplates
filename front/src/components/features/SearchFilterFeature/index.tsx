import "./styles.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {useUrlQueries} from "lys-front/providers";
import {useLysDialog} from "lys-front/providers";
import {useFilterLabels} from "lys-front/providers";
import {SearchFilterFeatureProps, ActiveFilter} from "./types";
import {useSearchFilterFeatureTranslations} from "./translations";
import QuickSearchInputElement from "@/components/elements/QuickSearchInputElement";
import SortDropdownElement, {SortDirection} from "@/components/elements/SortDropdownElement";
import ActiveFilterBadgesElement from "@/components/elements/ActiveFilterBadgesElement";
import FormFeature from "@/components/features/FormFeature";
import ButtonElement from "@/components/elements/ButtonElement";
import PageContainerElement from "@/components/elements/PageContainerElement";
import CardElement from "@/components/elements/CardElement";

/**
 * SearchFilterFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Optional quick search with debounce
 * - Sort dropdown with direction toggle
 * - Advanced filters in offcanvas modal
 * - Active filter badges display
 * - URL query parameter synchronization
 *
 * This is a Feature (Layer 2) - manages URL state and passes it to pure Elements.
 * Configuration comes from Layer 3 (restrictedFeatures).
 */
const SearchFilterFeature: React.FC<SearchFilterFeatureProps> = ({
    enableQuickSearch = false,
    quickSearchParamKey = "search",
    quickSearchPlaceholder,
    quickSearchDebounce = 400,
    sortOptions,
    defaultSort,
    defaultSortDirection = "DESC",
    orderByParamKey = "orderBy",
    orderDirParamKey = "orderDir",
    filterSections,
    onParametersChange,
    actions,
    children
}) => {
    const {t} = useSearchFilterFeatureTranslations();
    const {appliedParams, edit, update} = useUrlQueries();
    const {open, close} = useLysDialog();
    const {getLabel} = useFilterLabels();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    // Local state for sort (initialized from URL or defaults)
    const [sortField, setSortField] = useState<string>(
        appliedParams.get(orderByParamKey) || defaultSort || sortOptions[0]?.key || ""
    );
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        (appliedParams.get(orderDirParamKey) as SortDirection) || defaultSortDirection
    );

    // Local state for quick search (initialized from URL)
    const [searchValue, setSearchValue] = useState<string>(
        appliedParams.get(quickSearchParamKey) || ""
    );

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Initialize URL with defaults if not set
     */
    useEffect(() => {
        const urlSortField = appliedParams.get(orderByParamKey);
        const urlSortDir = appliedParams.get(orderDirParamKey);

        if (!urlSortField && defaultSort) {
            edit(orderByParamKey, defaultSort);
        }
        if (!urlSortDir) {
            edit(orderDirParamKey, defaultSortDirection);
        }
    }, [orderByParamKey, orderDirParamKey, defaultSort, defaultSortDirection, edit]);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Calculate active filters from URL
     */
    const activeFilters: ActiveFilter[] = useMemo(() => {
        const filters: ActiveFilter[] = [];

        // Iterate through URL query parameters
        if (filterSections) {
            filterSections.forEach((section) => {
                section.controls.forEach((control) => {
                    const value = appliedParams.get(control.valueKey);
                    if (value !== null && value !== "") {
                        // Resolve label from inline options first (covers native selects
                        // with options declared in the config), fall back to getLabel
                        // for custom controls that register labels via setLabel.
                        const optionLabel = control.options
                            ?.flatMap(o => "options" in o ? o.options : [o])
                            .find(o => o.value === value)?.label;
                        const displayValue = optionLabel ?? getLabel(value);
                        filters.push({
                            key: control.valueKey,
                            label: control.label,
                            value: displayValue
                        });
                    }
                });
            });
        }

        return filters;
    }, [filterSections, appliedParams, getLabel]);

    /**
     * Current filter values for form initial state
     */
    const currentFilterValues = useMemo(() => {
        const values: Record<string, any> = {};

        if (filterSections) {
            filterSections.forEach((section) => {
                section.controls.forEach((control) => {
                    const urlValue = appliedParams.get(control.valueKey);
                    if (urlValue !== null) {
                        values[control.valueKey] = urlValue;
                    }
                });
            });
        }

        return values;
    }, [filterSections, appliedParams]);

    /**
     * Count of active filters (excluding sort)
     */
    const filterCount = activeFilters.length;

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle parameter change notification
     */
    const handleParametersChange = useCallback(() => {
        if (onParametersChange) {
            const params = new URLSearchParams(window.location.search);
            onParametersChange(params);
        }
    }, [onParametersChange]);

    /**
     * Handle search value change
     */
    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
        edit(quickSearchParamKey, value.trim() === "" ? null : value.trim());
        handleParametersChange();
    }, [quickSearchParamKey, edit, handleParametersChange]);

    /**
     * Handle sort field change
     */
    const handleSortFieldChange = useCallback((field: string) => {
        setSortField(field);
        edit(orderByParamKey, field);
        handleParametersChange();
    }, [orderByParamKey, edit, handleParametersChange]);

    /**
     * Handle sort direction change
     */
    const handleSortDirectionChange = useCallback((direction: SortDirection) => {
        setSortDirection(direction);
        edit(orderDirParamKey, direction);
        handleParametersChange();
    }, [orderDirParamKey, edit, handleParametersChange]);

    /**
     * Handle filter removal
     */
    const handleFilterRemove = useCallback((key: string) => {
        edit(key, null);
        handleParametersChange();
    }, [edit, handleParametersChange]);

    /**
     * Handle clear all filters
     */
    const handleClearAllFilters = useCallback(() => {
        const updates: Record<string, null> = {};
        activeFilters.forEach((filter) => {
            updates[filter.key] = null;
        });
        update(updates);
        handleParametersChange();
    }, [activeFilters, update, handleParametersChange]);

    /**
     * Apply filters from form
     */
    const handleApplyFilters = useCallback(
        (values: Record<string, any>) => {
            // Update URL with filter values
            const updates: Record<string, string | null> = {};
            Object.entries(values).forEach(([key, value]) => {
                updates[key] = value !== undefined && value !== "" ? String(value) : null;
            });

            update(updates);
            close();
            handleParametersChange();
        },
        [update, close, handleParametersChange]
    );

    /**
     * Open filter offcanvas
     */
    const handleOpenFilters = useCallback(() => {
        open({
            uniqueKey: "search-filter-offcanvas",
            title: t("filters"),
            placement: "end",
            syncWithUrl: false,  // Don't sync this dialog with URL to avoid conflicts with filter params
            body: (
                <CardElement variant="flat" padding="lg">
                    <FormFeature
                        uniqueKey="search-filter-form"
                        sections={filterSections || []}
                        submit={handleApplyFilters}
                        initParameters={currentFilterValues}
                        submitButtonText={t("applyFilters")}
                        showReset={true}
                        resetButtonText={t("clearAll")}
                    />
                </CardElement>
            )
        });
    }, [open, t, filterSections, handleApplyFilters, currentFilterValues]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <div className="search-filter-feature">
            <PageContainerElement>
                {/* Search and Sort toolbar (carded) */}
                <div className="search-filter-feature__bar">
                <Row className="g-2 align-items-end">
                {/* Quick Search */}
                {enableQuickSearch && (
                    <Col xs={12} md={6} lg={4}>
                        <QuickSearchInputElement
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder={quickSearchPlaceholder || t("quickSearchPlaceholder")}
                            debounce={quickSearchDebounce}
                        />
                    </Col>
                )}

                {/* Sort Dropdown */}
                <Col xs={12} md={6} lg={4}>
                    <SortDropdownElement
                        sortOptions={sortOptions}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSortFieldChange={handleSortFieldChange}
                        onSortDirectionChange={handleSortDirectionChange}
                        label={t("sortBy")}
                        ascendingLabel={t("ascending")}
                        descendingLabel={t("descending")}
                    />
                </Col>

                {/* Filter Button */}
                {filterSections && filterSections.length > 0 && (
                    <Col xs={12} md={6} lg="auto">
                        <ButtonElement variant="outline-primary" onClick={handleOpenFilters} className="w-100">
                            <i className="bi bi-funnel me-2" />
                            {filterCount > 0 ? t("filtersCount", {values: {count: filterCount}}) : t("filters")}
                        </ButtonElement>
                    </Col>
                )}
            </Row>
                </div>

                {/* Active Filter Badges */}
                {activeFilters.length > 0 && (
                    <Row className="mb-3">
                        <Col>
                            <ActiveFilterBadgesElement
                                filters={activeFilters}
                                label={t("activeFilters")}
                                clearAllText={t("clearAll")}
                                onRemove={handleFilterRemove}
                                onClearAll={handleClearAllFilters}
                            />
                        </Col>
                    </Row>
                )}

                {/* Actions Container */}
                {actions && (
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-end">
                            {actions}
                        </Col>
                    </Row>
                )}
            </PageContainerElement>

            {/* Page Content */}
            {children && (
                <PageContainerElement>
                    {children}
                </PageContainerElement>
            )}
        </div>
    );
};

SearchFilterFeature.displayName = "SearchFilterFeature";

export default SearchFilterFeature;