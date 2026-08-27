import React, {useMemo} from "react";
import "./styles.scss";
import {ConnectedUserManagementTabsFeatureProps} from "./types";
import {useConnectedUserManagementTabsFeatureTranslations} from "./translations";
import UpdateUserEmailRestricted from "@/components/restrictedFeatures/UpdateUserEmailRestricted";
import UpdateUserPasswordRestricted from "@/components/restrictedFeatures/UpdateUserPasswordRestricted";
import UpdateUserPrivateDataRestricted from "@/components/restrictedFeatures/UpdateUserPrivateDataRestricted";
import UpdateUserEventPreferencesRestricted from "@/components/restrictedFeatures/UpdateUserEventPreferencesRestricted";
import ManageUserSSORestricted from "@/components/restrictedFeatures/ManageUserSSORestricted";
import TabElement from "@/components/elements/TabElement";
import {TabItem} from "@/components/elements/TabElement/types";

/**
 * Tab keys enum for type safety
 */
enum ConnectedUserManagementTab {
    PRIVATE_DATA = "privateData",
    EMAIL = "email",
    PASSWORD = "password",
    SSO = "sso",
    NOTIFICATIONS = "notifications"
}

/**
 * ConnectedUserManagementTabsFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Tab navigation for user account settings
 * - Lazy rendering (only active tab is rendered)
 * - Personal information, email, and password management
 * - Loading state handling
 *
 * This component uses Relay fragments for data fetching.
 * It receives user data as props and displays appropriate UI.
 */
const ConnectedUserManagementTabsFeature: React.FC<ConnectedUserManagementTabsFeatureProps> = ({userData, onCompleted}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useConnectedUserManagementTabsFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Tab items configuration for TabElement
     * Updates when userData changes
     */
    const tabItems: Record<string, TabItem> = useMemo(() => ({
        [ConnectedUserManagementTab.PRIVATE_DATA]: {
            label: t("privateData"),
            icon: "bi-person",
            render: () => (
                <UpdateUserPrivateDataRestricted
                    userId={userData?.id || ""}
                    accessParameters={{ownerIds: [userData?.id || ""]}}
                    firstName={userData?.privateData?.firstName || undefined}
                    lastName={userData?.privateData?.lastName || undefined}
                    genderCode={userData?.privateData?.gender?.code || undefined}
                    languageCode={userData?.language?.code || undefined}
                    footer={
                        <p className="text-muted small mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            {t("privateDataDescription")}
                        </p>
                    }
                    onCompleted={onCompleted}
                />
            )
        },
        [ConnectedUserManagementTab.EMAIL]: {
            label: t("email"),
            icon: "bi-envelope",
            render: () => (
                <UpdateUserEmailRestricted
                    userId={userData?.id || ""}
                    accessParameters={{ownerIds: [userData?.id || ""]}}
                    currentEmail={userData?.emailAddress?.address || ""}
                    validatedAt={userData?.emailAddress?.validatedAt}
                    lastValidationRequestAt={userData?.emailAddress?.lastValidationRequestAt}
                    onCompleted={onCompleted}
                />
            )
        },
        [ConnectedUserManagementTab.PASSWORD]: {
            label: t("password"),
            icon: "bi-key",
            render: () => (
                <UpdateUserPasswordRestricted
                    userId={userData?.id || ""}
                    accessParameters={{ownerIds: [userData?.id || ""]}}
                />
            )
        },
        [ConnectedUserManagementTab.SSO]: {
            label: t("sso"),
            icon: "bi-link-45deg",
            render: () => (
                <ManageUserSSORestricted userId={userData?.id || ""} />
            )
        },
        [ConnectedUserManagementTab.NOTIFICATIONS]: {
            label: t("notifications"),
            icon: "bi-bell",
            render: () => (
                <UpdateUserEventPreferencesRestricted
                    accessParameters={{ownerIds: [userData?.id || ""]}}
                    footer={
                        <p className="text-muted small mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            {t("notificationsDescription")}
                        </p>
                    }
                    onCompleted={onCompleted}
                />
            )
        }
    }), [t, userData, onCompleted]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <div className="connected-user-management-tabs-feature">
            <TabElement
                uniqueKey="connected-user-management-tabs"
                items={tabItems}
                defaultActiveKey={ConnectedUserManagementTab.PRIVATE_DATA}
            />
        </div>
    )
};

ConnectedUserManagementTabsFeature.displayName = "ConnectedUserManagementTabsFeature";

export default ConnectedUserManagementTabsFeature;
