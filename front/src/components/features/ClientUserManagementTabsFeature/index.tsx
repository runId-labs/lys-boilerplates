import React, {useMemo} from "react";
import {useFragment} from "react-relay";
import {ClientUserManagementTabsFeatureProps} from "./types";
import {useClientUserManagementTabsFeatureTranslations} from "./translations";
import UpdateClientUserPrivateDataRestricted from "@/components/restrictedFeatures/UpdateClientUserPrivateDataRestricted";
import UpdateClientUserEmailRestricted from "@/components/restrictedFeatures/UpdateClientUserEmailRestricted";
import UpdateClientUserRolesRestricted from "@/components/restrictedFeatures/UpdateClientUserRolesRestricted";
import {UpdateClientUserPrivateDataRestrictedFragment} from "@/components/restrictedFeatures/UpdateClientUserPrivateDataRestricted/UpdateClientUserPrivateDataRestrictedFragment";
import {UpdateClientUserEmailRestrictedFragment} from "@/components/restrictedFeatures/UpdateClientUserEmailRestricted/UpdateClientUserEmailRestrictedFragment";
import {UpdateClientUserRolesRestrictedFragment} from "@/components/restrictedFeatures/UpdateClientUserRolesRestricted/UpdateClientUserRolesRestrictedFragment";
import TabElement from "@/components/elements/TabElement";
import {TabItem} from "@/components/elements/TabElement/types";

/**
 * Tab keys enum for type safety
 */
enum ClientUserManagementTab {
    PRIVATE_DATA = "privateData",
    EMAIL = "email",
    ROLES = "roles"
}

/**
 * ClientUserManagementTabsFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Tabbed interface for client user management
 * - Personal information, email, and roles management tabs
 * - Loading state handling
 *
 * This component receives fragment refs and unmasks them using useFragment.
 * It is responsible for its own data unmasking.
 */
const ClientUserManagementTabsFeature: React.FC<ClientUserManagementTabsFeatureProps> = ({clientUserFragmentRef, onCompleted}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useClientUserManagementTabsFeatureTranslations();

    // Unmask fragment data using useFragment
    const privateDataFragment = useFragment(UpdateClientUserPrivateDataRestrictedFragment, clientUserFragmentRef ?? null);
    const emailDataFragment = useFragment(UpdateClientUserEmailRestrictedFragment, clientUserFragmentRef ?? null);
    const rolesDataFragment = useFragment(UpdateClientUserRolesRestrictedFragment, clientUserFragmentRef ?? null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Tab items configuration
     * Updates when fragments change
     * Data is now directly on UserNode (not nested in .user)
     */
    const tabItems = useMemo<Record<string, TabItem>>(() => ({
        [ClientUserManagementTab.PRIVATE_DATA]: {
            label: t("privateDataTab"),
            icon: "bi-person",
            render: () => (
                <UpdateClientUserPrivateDataRestricted
                    clientUserId={privateDataFragment?.id || ""}
                    firstName={privateDataFragment?.privateData?.firstName || undefined}
                    lastName={privateDataFragment?.privateData?.lastName || undefined}
                    genderCode={privateDataFragment?.privateData?.gender?.code || undefined}
                    languageCode={privateDataFragment?.language?.code || undefined}
                    onCompleted={onCompleted}
                />
            )
        },
        [ClientUserManagementTab.EMAIL]: {
            label: t("emailTab"),
            icon: "bi-envelope",
            render: () => (
                <UpdateClientUserEmailRestricted
                    clientUserId={emailDataFragment?.id || ""}
                    currentEmail={emailDataFragment?.emailAddress?.address || ""}
                    validatedAt={emailDataFragment?.emailAddress?.validatedAt}
                    lastValidationRequestAt={emailDataFragment?.emailAddress?.lastValidationRequestAt}
                    onCompleted={onCompleted}
                />
            )
        },
        [ClientUserManagementTab.ROLES]: {
            label: t("rolesTab"),
            icon: "bi-person-badge",
            render: () => {
                // Extract role codes from rolesDataFragment (now organizationRoles)
                const roleCodes = rolesDataFragment?.organizationRoles?.map((role: {code: string}) => role.code) || [];

                return (
                    <UpdateClientUserRolesRestricted
                        clientUserId={rolesDataFragment?.id || ""}
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
            uniqueKey="client-user-management-tabs"
            items={tabItems}
            defaultActiveKey={ClientUserManagementTab.PRIVATE_DATA}
        />
    );
};

ClientUserManagementTabsFeature.displayName = "ClientUserManagementTabsFeature";

export default ClientUserManagementTabsFeature;
