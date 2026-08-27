import React, {useMemo} from "react";
import {useFragment} from "react-relay";
import {UserManagementTabsFeatureProps} from "./types";
import {useUserManagementTabsFeatureTranslations} from "./translations";
import UpdateUserPrivateDataRestricted from "@/components/restrictedFeatures/UpdateUserPrivateDataRestricted";
import UpdateUserEmailRestricted from "@/components/restrictedFeatures/UpdateUserEmailRestricted";
import {UpdateUserPrivateDataRestrictedFragment} from "@/components/restrictedFeatures/UpdateUserPrivateDataRestricted/UpdateUserPrivateDataRestrictedFragment";
import {UpdateUserEmailRestrictedFragment} from "@/components/restrictedFeatures/UpdateUserEmailRestricted/UpdateUserEmailRestrictedFragment";
import TabElement from "@/components/elements/TabElement";
import {TabItem} from "@/components/elements/TabElement/types";

/**
 * Tab keys enum for type safety
 */
enum UserManagementTab {
    PRIVATE_DATA = "privateData",
    EMAIL = "email"
}

/**
 * UserManagementTabsFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Tabbed interface for user management (without roles)
 * - Personal information and email management tabs
 * - Loading state handling
 *
 * This component receives fragment refs and unmasks them using useFragment.
 * It is responsible for its own data unmasking.
 */
const UserManagementTabsFeature: React.FC<UserManagementTabsFeatureProps> = ({userFragmentRef, onCompleted}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useUserManagementTabsFeatureTranslations();

    // Unmask fragment data using useFragment
    const privateDataFragment = useFragment(UpdateUserPrivateDataRestrictedFragment, userFragmentRef ?? null);
    const emailDataFragment = useFragment(UpdateUserEmailRestrictedFragment, userFragmentRef ?? null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Tab items configuration
     * Updates when fragments change
     */
    const tabItems = useMemo<Record<string, TabItem>>(() => ({
        [UserManagementTab.PRIVATE_DATA]: {
            label: t("privateDataTab"),
            icon: "bi-person",
            render: () => (
                <UpdateUserPrivateDataRestricted
                    userId={privateDataFragment?.id || ""}
                    accessParameters={{ownerIds: [privateDataFragment?.id || ""]}}
                    firstName={privateDataFragment?.privateData?.firstName || undefined}
                    lastName={privateDataFragment?.privateData?.lastName || undefined}
                    genderCode={privateDataFragment?.privateData?.gender?.code || undefined}
                    languageCode={privateDataFragment?.language?.code || undefined}
                    onCompleted={onCompleted}
                />
            )
        },
        [UserManagementTab.EMAIL]: {
            label: t("emailTab"),
            icon: "bi-envelope",
            render: () => (
                <UpdateUserEmailRestricted
                    userId={emailDataFragment?.id || ""}
                    accessParameters={{ownerIds: [emailDataFragment?.id || ""]}}
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
            uniqueKey="user-management-tabs"
            items={tabItems}
            defaultActiveKey={UserManagementTab.PRIVATE_DATA}
        />
    );
};

UserManagementTabsFeature.displayName = "UserManagementTabsFeature";

export default UserManagementTabsFeature;