import React, {useMemo, useState} from "react";
import {ManagePlanVersionDropdownFeatureProps} from "./types";
import {useManagePlanVersionDropdownFeatureTranslations} from "./translations";
import DropDownMenuElement from "@/components/elements/DropDownMenuElement";
import {DropDownMenu} from "@/components/elements/DropDownMenuElement/types";
import SetPlanVersionRuleRestricted from "@/components/restrictedFeatures/SetPlanVersionRuleRestricted";
import {SetPlanVersionRuleRestrictedRefInterface} from "@/components/restrictedFeatures/SetPlanVersionRuleRestricted/types";
import SetPlanVersionEnabledRestricted from "@/components/restrictedFeatures/SetPlanVersionEnabledRestricted";
import {SetPlanVersionEnabledRestrictedRefInterface} from "@/components/restrictedFeatures/SetPlanVersionEnabledRestricted/types";

/**
 * ManagePlanVersionDropdownFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Dropdown menu with the catalogue actions of a plan version
 * - Permission-aware menu items (disabled if no permission)
 *
 * Publishing a version is not here: it creates a version rather than editing
 * one, so it belongs to the list header.
 */
const ManagePlanVersionDropdownFeature: React.FC<ManagePlanVersionDropdownFeatureProps> = ({
    planVersionId,
    enabled,
    rules,
    onUpdated
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useManagePlanVersionDropdownFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [setRuleRef, setSetRuleRef] = useState<SetPlanVersionRuleRestrictedRefInterface | null>(null);
    const [setEnabledRef, setSetEnabledRef] = useState<SetPlanVersionEnabledRestrictedRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    const menus = useMemo<DropDownMenu[]>(() => {
        const items: DropDownMenu = {};

        if (setRuleRef?.hasPermission) {
            items.setRule = {
                icon: <i className="bi bi-sliders" />,
                label: t("menuSetRule"),
                onClick: () => setRuleRef?.open()
            };
        }

        if (setEnabledRef?.hasPermission) {
            items.setEnabled = {
                icon: <i className={enabled ? "bi bi-x-circle" : "bi bi-check-circle"} />,
                label: enabled ? t("menuRetire") : t("menuPutOnSale"),
                variant: enabled ? "danger" : "success",
                onClick: () => setEnabledRef?.open()
            };
        }

        return Object.keys(items).length > 0 ? [items] : [];
    }, [t, enabled, setRuleRef, setEnabledRef]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <>
            <SetPlanVersionRuleRestricted
                ref={setSetRuleRef}
                planVersionId={planVersionId}
                rules={rules}
                display={false}
                onUpdated={onUpdated}
            />
            <SetPlanVersionEnabledRestricted
                ref={setSetEnabledRef}
                planVersionId={planVersionId}
                enabled={enabled}
                display={false}
                onUpdated={onUpdated}
            />
            <DropDownMenuElement
                menus={menus}
                variant="link"
                size="sm"
                align="end"
            />
        </>
    );
};

ManagePlanVersionDropdownFeature.displayName = "ManagePlanVersionDropdownFeature";

export default ManagePlanVersionDropdownFeature;
