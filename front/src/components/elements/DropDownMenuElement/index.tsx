import React, {useMemo} from "react";
import {Dropdown} from "react-bootstrap";
import {DropDownMenuElementProps} from "./types";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * DropDownMenuElement component
 *
 * Element component (Layer 1) that provides a dropdown menu with:
 * - Multiple menu sections separated by dividers
 * - Conditional item rendering (items without onClick are hidden)
 * - Icon support for items
 * - Disabled state support
 * - Color variants for items
 * - Customizable toggle button
 * - Alignment options
 *
 * Improvements over arum-front DropDownMenuElement:
 * - No useEffect for rendering (direct rendering from props)
 * - No intermediate state storage
 * - Simpler, more maintainable code
 * - Better performance (single render pass)
 * - Type-safe props
 */
const DropDownMenuElement: React.FC<DropDownMenuElementProps> = ({
    menus,
    toggleContent,
    className,
    variant = "link",
    size,
    align = "end",
}) => {
    /**
     * Filter menus to only include items with onClick handlers
     */
    const visibleMenus = useMemo(() => {
        return menus
            .map((menu) =>
                Object.entries(menu).filter(([, item]) => item.onClick !== undefined)
            )
            .filter((menu) => menu.length > 0);
    }, [menus]);

    /**
     * Check if there are any visible items
     */
    const hasVisibleItems = visibleMenus.length > 0;

    // Don't render if no visible items
    if (!hasVisibleItems) {
        return null;
    }

    return (
        <Dropdown className={cn("dropdown-menu-element", className)} align={align}>
            <Dropdown.Toggle variant={variant} size={size} id="dropdown-menu-toggle">
                {toggleContent || (
                    <i className="bi bi-three-dots-vertical"></i>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu
                renderOnMount
                popperConfig={{
                    strategy: "fixed"
                }}
            >
                {visibleMenus.map((menu, menuIndex) => (
                    <React.Fragment key={`menu-section-${menuIndex}`}>
                        {/* Divider between sections */}
                        {menuIndex > 0 && <Dropdown.Divider />}

                        {/* Render items in this section */}
                        {menu.map(([itemKey, item]) => {
                            const itemClassName = cn(
                                item.variant === "danger" && "text-danger",
                                item.variant === "success" && "text-success",
                                item.variant === "warning" && "text-warning",
                                item.active && "active"
                            );

                            return (
                                <Dropdown.Item
                                    key={itemKey}
                                    onClick={item.onClick}
                                    disabled={item.disabled}
                                    className={itemClassName}
                                >
                                    {item.icon && (
                                        <span className="me-2">{item.icon}</span>
                                    )}
                                    {item.label}
                                </Dropdown.Item>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

DropDownMenuElement.displayName = "DropDownMenuElement";

export default DropDownMenuElement;