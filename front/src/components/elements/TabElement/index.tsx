import React, {useState, useCallback, useMemo} from "react";
import {Nav, Tab} from "react-bootstrap";
import {TabElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * TabElement component
 *
 * Element component (Layer 1) that provides:
 * - Tab navigation with Bootstrap styling
 * - Lazy rendering (only active tab content is rendered)
 * - Flexible content via render functions
 * - Optional icons for tabs
 *
 * This is an element component (Layer 1) that:
 * - Wraps react-bootstrap Tab components
 * - Provides simple tab navigation interface
 * - No business logic, pure UI component
 */
const TabElement: React.FC<TabElementProps> = ({
    items,
    defaultActiveKey,
    onTabChange,
    className
}) => {
    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    // Filter items based on visible property (default: true)
    const visibleItemKeys = useMemo(
        () => Object.keys(items).filter(key => items[key].visible !== false),
        [items]
    );
    const effectiveDefaultKey = defaultActiveKey && visibleItemKeys.includes(defaultActiveKey)
        ? defaultActiveKey
        : visibleItemKeys[0];

    const [activeKey, setActiveKey] = useState<string>(effectiveDefaultKey);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle tab selection
     */
    const handleSelect = useCallback((key: string | null) => {
        if (key) {
            setActiveKey(key);
            onTabChange?.(key);
        }
    }, [onTabChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    // Don't render if no visible tabs
    if (visibleItemKeys.length === 0) {
        return null;
    }

    return (
        <div className={cn("tab-element", className)}>
            <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
                {/* Tab Navigation */}
                <Nav variant="tabs" className="mb-3">
                    {visibleItemKeys.map((key) => {
                        const item = items[key];
                        return (
                            <Nav.Item key={key}>
                                <Nav.Link eventKey={key}>
                                    {item.icon && <i className={`bi ${item.icon} me-2`}></i>}
                                    {item.label}
                                </Nav.Link>
                            </Nav.Item>
                        );
                    })}
                </Nav>

                {/* Tab Content - Lazy rendered */}
                <Tab.Content>
                    {visibleItemKeys.map((key) => {
                        const item = items[key];
                        const isActive = activeKey === key;

                        return (
                            <Tab.Pane key={key} eventKey={key}>
                                {isActive && item.render()}
                            </Tab.Pane>
                        );
                    })}
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

TabElement.displayName = "TabElement";

export default TabElement;
