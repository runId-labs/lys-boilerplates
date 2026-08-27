import React, {useMemo} from "react";
import {useFragment} from "react-relay";
import {AdminManagementTabsFeatureProps} from "./types";
import {useAdminManagementTabsFeatureTranslations} from "./translations";
import UpdateUserPrivateDataRestricted from "@/components/restrictedFeatures/UpdateUserPrivateDataRestricted";
import UpdateUserEmailRestricted from "@/components/restrictedFeatures/UpdateUserEmailRestricted";
import UpdateUserRolesRestricted from "@/components/restrictedFeatures/UpdateUserRolesRestricted";
import {UpdateUserPrivateDataRestrictedFragment} from "@/components/restrictedFeatures/UpdateUserPrivateDataRestricted/UpdateUserPrivateDataRestrictedFragment";
import {UpdateUserEmailRestrictedFragment} from "@/components/restrictedFeatures/UpdateUserEmailRestricted/UpdateUserEmailRestrictedFragment";
import {UpdateUserRolesRestrictedFragment} from "@/components/restrictedFeatures/UpdateUserRolesRestricted/UpdateUserRolesRestrictedFragment";
import TabElement from "@/components/elements/TabElement";
import {TabItem} from "@/components/elements/TabElement/types";

/**
 * Tab keys enum for type safety
 */
enum UserManagementTab {
    PRIVATE_DATA = "privateData",
    EMAIL = "email",
    ROLES = "roles"
}

/**
 * AdminManagementTabsFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Tabbed interface for admin/user management
 * - Personal information and email management tabs
 * - Loading state handling
 *
 * This component receives fragment refs and unmasks them using useFragment.
 * It is responsible for its own data unmasking.
 */
const AdminManagementTabsFeature: React.FC<AdminManagementTabsFeatureProps> = ({userFragmentRef, onCompleted}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useAdminManagementTabsFeatureTranslations();

    // Unmask fragment data using useFragment
    const privateDataFragment = useFragment(UpdateUserPrivateDataRestrictedFragment, userFragmentRef ?? null);
    const emailDataFragment = useFragment(UpdateUserEmailRestrictedFragment, userFragmentRef ?? null);
    const rolesDataFragment = useFragment(UpdateUserRolesRestrictedFragment, userFragmentRef ?? null);

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
                    currentEmail={emailDataFragment?.emailAddress?.address || ""}
                    validatedAt={emailDataFragment?.emailAddress?.validatedAt}
                    lastValidationRequestAt={emailDataFragment?.emailAddress?.lastValidationRequestAt}
                    onCompleted={onCompleted}
                />
            )
        },
        [UserManagementTab.ROLES]: {
            label: t("rolesTab"),
            icon: "bi-person-badge",
            render: () => {
                // Extract role codes from rolesDataFragment
                const roleCodes = rolesDataFragment?.roles?.map((role: {code: string}) => role.code) || [];

                return (
                    <UpdateUserRolesRestricted
                        userId={rolesDataFragment?.id || ""}
                        roleCodes={roleCodes}
                        onCompleted={onCompleted}
                    />
                );
            }
        }
    }), [privateDataFragment, emailDataFragment, rolesDataFragment, t, onCompleted]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <TabElement
            uniqueKey="admin-management-tabs"
            items={tabItems}
            defaultActiveKey={UserManagementTab.PRIVATE_DATA}
        />
    );
};

AdminManagementTabsFeature.displayName = "AdminManagementTabsFeature";

export default AdminManagementTabsFeature;