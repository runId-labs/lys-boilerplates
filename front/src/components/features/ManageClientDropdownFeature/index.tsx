import React, {useMemo, useState} from "react";
import {ManageClientDropdownFeatureProps} from "./types";
import {useManageClientDropdownFeatureTranslations} from "./translations";
import DropDownMenuElement from "@/components/elements/DropDownMenuElement";
import {DropDownMenu} from "@/components/elements/DropDownMenuElement/types";
import GetClientRestricted from "@/components/restrictedFeatures/GetClientRestricted";
import GetUserRestricted from "@/components/restrictedFeatures/GetUserRestricted";
import GetSubscriptionRestricted from "@/components/restrictedFeatures/GetSubscriptionRestricted";
import {GetClientRestrictedRefInterface} from "@/components/restrictedFeatures/GetClientRestricted/types";
import {GetUserRestrictedRefInterface} from "@/components/restrictedFeatures/GetUserRestricted/types";
import {GetSubscriptionRestrictedRefInterface} from "@/components/restrictedFeatures/GetSubscriptionRestricted/types";
import SubscribeClientManuallyRestricted from "@/components/restrictedFeatures/SubscribeClientManuallyRestricted";
import {SubscribeClientManuallyRestrictedRefInterface} from "@/components/restrictedFeatures/SubscribeClientManuallyRestricted/types";
import SetSubscriptionBillingModeRestricted from "@/components/restrictedFeatures/SetSubscriptionBillingModeRestricted";
import {SetSubscriptionBillingModeRestrictedRefInterface} from "@/components/restrictedFeatures/SetSubscriptionBillingModeRestricted/types";

/**
 * ManageClientDropdownFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Dropdown menu with client management actions
 * - Permission-based action visibility
 * - Integration with GetClientRestricted, GetUserRestricted, GetSubscriptionRestricted
 */
const ManageClientDropdownFeature: React.FC<ManageClientDropdownFeatureProps> = ({
    clientId,
    ownerId,
    subscriptionId,
    currentSubscription,
    billingModeCode,
    allowPlanChange = true,
    onUpdated
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useManageClientDropdownFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    // Callback refs kept in state: a ref alone is updated during the child's
    // commit, after this component has already built its menu, so an action
    // becoming available or irrelevant would only show on the next render
    const [clientRef, setClientRef] = useState<GetClientRestrictedRefInterface | null>(null);
    const [userRef, setUserRef] = useState<GetUserRestrictedRefInterface | null>(null);
    const [subscriptionRef, setSubscriptionRef] = useState<GetSubscriptionRestrictedRefInterface | null>(null);
    const [subscribeManuallyRef, setSubscribeManuallyRef] = useState<SubscribeClientManuallyRestrictedRefInterface | null>(null);
    const [billingModeRef, setBillingModeRef] = useState<SetSubscriptionBillingModeRestrictedRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    // Build menu with only allowed actions based on permissions from refs
    const menus = useMemo<DropDownMenu[]>(() => {
        const items: DropDownMenu = {};

        if (clientRef?.hasPermission) {
            items.viewClient = {
                icon: <i className="bi bi-building" />,
                label: t("actionView"),
                onClick: () => clientRef?.open()
            };
        }

        if (userRef?.hasPermission) {
            items.viewOwner = {
                icon: <i className="bi bi-person" />,
                label: t("actionViewOwner"),
                onClick: () => userRef?.open()
            };
        }

        if (subscriptionId && subscriptionRef?.hasPermission) {
            items.manageSubscription = {
                icon: <i className="bi bi-credit-card" />,
                label: t("actionManageSubscription"),
                onClick: () => subscriptionRef?.open()
            };
        }

        if (subscriptionId && subscribeManuallyRef?.hasPermission) {
            items.assignOffer = {
                icon: <i className="bi bi-tag" />,
                label: t("actionAssignOffer"),
                onClick: () => subscribeManuallyRef?.open()
            };
        }

        if (subscriptionId && billingModeRef?.hasPermission) {
            items.billingMode = {
                icon: <i className="bi bi-arrow-left-right" />,
                label: t("actionBillingMode"),
                onClick: () => billingModeRef?.open()
            };
        }

        return Object.keys(items).length > 0 ? [items] : [];
    }, [t, subscriptionId, billingModeCode, billingModeRef?.hasPermission, clientRef?.hasPermission, userRef?.hasPermission, subscriptionRef?.hasPermission, subscribeManuallyRef?.hasPermission]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <>
            {/* Hidden restricted components - expose open() via refs */}
            <GetClientRestricted
                ref={setClientRef}
                clientId={clientId}
                display={false}
            />
            <GetUserRestricted
                ref={setUserRef}
                userId={ownerId}
                accessParameters={{ownerIds: [ownerId]}}
                display={false}
            />
            {subscriptionId && (
                <GetSubscriptionRestricted
                    ref={setSubscriptionRef}
                    subscriptionId={subscriptionId}
                    display={false}
                    allowPlanChange={allowPlanChange}
                />
            )}

            {subscriptionId && (
                <SubscribeClientManuallyRestricted
                    ref={setSubscribeManuallyRef}
                    subscriptionId={subscriptionId}
                    clientId={clientId}
                    current={currentSubscription}
                    display={false}
                    onUpdated={onUpdated}
                />
            )}

            {subscriptionId && (
                <SetSubscriptionBillingModeRestricted
                    ref={setBillingModeRef}
                    subscriptionId={subscriptionId}
                    billingModeCode={billingModeCode ?? null}
                    display={false}
                    onUpdated={onUpdated}
                />
            )}

            <DropDownMenuElement menus={menus} size="sm" />
        </>
    );
};

ManageClientDropdownFeature.displayName = "ManageClientDropdownFeature";

export default ManageClientDropdownFeature;