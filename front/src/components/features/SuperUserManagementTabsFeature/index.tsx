import React, {useMemo} from "react";
import {useFragment} from "react-relay";
import {SuperUserManagementTabsFeatureProps} from "./types";
import {useSuperUserManagementTabsFeatureTranslations} from "./translations";
import UpdateSuperUserPrivateDataRestricted from "@/components/restrictedFeatures/UpdateSuperUserPrivateDataRestricted";
import UpdateSuperUserEmailRestricted from "@/components/restrictedFeatures/UpdateSuperUserEmailRestricted";
import {UpdateSuperUserPrivateDataRestrictedFragment} from "@/components/restrictedFeatures/UpdateSuperUserPrivateDataRestricted/UpdateSuperUserPrivateDataRestrictedFragment";
import {UpdateSuperUserEmailRestrictedFragment} from "@/components/restrictedFeatures/UpdateSuperUserEmailRestricted/UpdateSuperUserEmailRestrictedFragment";
import TabElement from "@/components/elements/TabElement";
import {TabItem} from "@/components/elements/TabElement/types";

/**
 * Tab keys enum for type safety
 */
enum SuperUserManagementTab {
    PRIVATE_DATA = "privateData",
    EMAIL = "email"
}

/**
 * SuperUserManagementTabsFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Tabbed interface for super user management
 * - Personal information and email management tabs
 * - Loading state handling
 *
 * This component receives fragment refs and unmasks them using useFragment.
 * It is responsible for its own data unmasking.
 */
const SuperUserManagementTabsFeature: React.FC<SuperUserManagementTabsFeatureProps> = ({userFragmentRef, onCompleted}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useSuperUserManagementTabsFeatureTranslations();

    // Unmask fragment data using useFragment
    const privateDataFragment = useFragment(UpdateSuperUserPrivateDataRestrictedFragment, userFragmentRef ?? null);
    const emailDataFragment = useFragment(UpdateSuperUserEmailRestrictedFragment, userFragmentRef ?? null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Tab items configuration
     * Updates when fragments change
     */
    const tabItems = useMemo<Record<string, TabItem>>(() => ({
        [SuperUserManagementTab.PRIVATE_DATA]: {
            label: t("privateDataTab"),
            icon: "bi-person",
            render: () => (
                <UpdateSuperUserPrivateDataRestricted
                    userId={privateDataFragment?.id || ""}
                    firstName={privateDataFragment?.privateData?.firstName || undefined}
                    lastName={privateDataFragment?.privateData?.lastName || undefined}
                    genderCode={privateDataFragment?.privateData?.gender?.code || undefined}
                    languageCode={privateDataFragment?.language?.code || undefined}
                    onCompleted={onCompleted}
                />
            )
        },
        [SuperUserManagementTab.EMAIL]: {
            label: t("emailTab"),
            icon: "bi-envelope",
            render: () => (
                <UpdateSuperUserEmailRestricted
                    userId={emailDataFragment?.id || ""}
                    currentEmail={emailDataFragment?.emailAddress?.address || ""}
                    validatedAt={emailDataFragment?.emailAddress?.validatedAt}
                    lastValidationRequestAt={emailDataFragment?.emailAddress?.lastValidationRequestAt}
                    onCompleted={onCompleted}
                />
            )
        }
    }), [privateDataFragment, emailDataFragment, t, onCompleted]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <TabElement
            uniqueKey="super-user-management-tabs"
            items={tabItems}
            defaultActiveKey={SuperUserManagementTab.PRIVATE_DATA}
        />
    );
};

SuperUserManagementTabsFeature.displayName = "SuperUserManagementTabsFeature";

export default SuperUserManagementTabsFeature;