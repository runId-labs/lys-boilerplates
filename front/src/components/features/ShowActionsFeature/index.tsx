import "./styles.scss";
import React, {useMemo} from "react";
import {ShowActionsFeatureProps, SecondaryAction} from "./types";
import {useShowActionsFeatureTranslations} from "./translations";
import ButtonElement from "@/components/elements/ButtonElement";
import DropDownMenuElement from "@/components/elements/DropDownMenuElement";
import {DropDownItem, DropDownMenu} from "@/components/elements/DropDownMenuElement/types";

/**
 * ShowActionsFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Primary action button (main CTA)
 * - Secondary actions dropdown (optional)
 * - Right-aligned layout for consistent platform UX
 *
 * All platform actions should be right-aligned.
 * Primary action attracts attention, secondary actions are grouped in dropdown.
 */
const ShowActionsFeature: React.FC<ShowActionsFeatureProps> = ({
    primaryAction,
    secondaryActions
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useShowActionsFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Filter out null/undefined secondary actions
     */
    const validSecondaryActions = useMemo(() => {
        if (!secondaryActions) return [];
        return secondaryActions.filter((action): action is SecondaryAction => action != null);
    }, [secondaryActions]);

    /**
     * Transform secondary actions to dropdown menu format
     */
    const dropdownMenus = useMemo<DropDownMenu[]>(() => {
        if (validSecondaryActions.length === 0) return [];

        const menuItems: DropDownMenu = {};
        validSecondaryActions.forEach((action) => {
            const item: DropDownItem = {
                label: action.label,
                onClick: action.onClick,
                disabled: action.disabled
            };
            if (action.icon) {
                item.icon = action.icon as React.ReactElement;
            }
            menuItems[action.key] = item;
        });

        return [menuItems];
    }, [validSecondaryActions]);

    /**
     * Check if we have any actions to display
     */
    const hasActions = primaryAction || validSecondaryActions.length > 0;

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (!hasActions) {
        return null;
    }

    return (
        <div className="show-actions-feature">
            {/* Primary Action Button */}
            {primaryAction && (
                <ButtonElement
                    variant={primaryAction.variant || "primary"}
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className="show-actions-feature__primary-btn"
                >
                    {primaryAction.icon && (
                        <i className={`${primaryAction.icon} me-2`} />
                    )}
                    {primaryAction.label}
                </ButtonElement>
            )}

            {/* Secondary Actions Dropdown */}
            {validSecondaryActions.length > 0 && (
                <DropDownMenuElement
                    menus={dropdownMenus}
                    variant="outline-secondary"
                    toggleContent={<><i className="bi bi-three-dots-vertical me-1" />{t("otherActions")}</>}
                    className="show-actions-feature__secondary-dropdown"
                />
            )}
        </div>
    );
};

ShowActionsFeature.displayName = "ShowActionsFeature";

export default ShowActionsFeature;