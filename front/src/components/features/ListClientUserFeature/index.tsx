import React, {useMemo} from "react";
import {useFragment} from "react-relay";
import {ListClientUserFeatureProps} from "./types";
import {ListUserFeatureFragment_clientUser} from "@/components/features/ListUserFeature/ListUserFeatureFragment";
import {useListClientUserFeatureTranslations} from "./translations";
import {CommonTranslationKey} from "@/services/i18n/common";
import ListFeature from "@/components/features/ListFeature";
import BadgeElement from "@/components/elements/BadgeElement";
import CountBadgeElement from "@/components/elements/CountBadgeElement";
import {TableColumn, TableRowData} from "@/components/elements/TableElement/types";

/**
 * User status configuration
 */
type UserStatusCode = "ENABLED" | "DISABLED" | "REVOKED" | "DELETED";

interface UserStatusConfig {
    variant: "success" | "danger" | "warning" | "secondary";
    translationKey: string;
}

const userStatusConfig: Record<UserStatusCode | "unknown", UserStatusConfig> = {
    ENABLED: {variant: "success", translationKey: "statusActive"},
    DISABLED: {variant: "secondary", translationKey: "statusInactive"},
    REVOKED: {variant: "warning", translationKey: "statusRevoked"},
    DELETED: {variant: "danger", translationKey: "statusDeleted"},
    unknown: {variant: "secondary", translationKey: "statusUnknown"}
};

/**
 * ListClientUserFeature component
 *
 * Autonomous feature component (Layer 2) for client users
 * - Manages GraphQL fragment
 * - Defines client user-specific columns (includes client column)
 * - Transforms data
 * - Uses ListFeature for rendering
 */
const ListClientUserFeature: React.FC<ListClientUserFeatureProps> = ({
    clientUsersFragmentRef,
    pageInfo,
    itemsPerPage,
    actionGenerator,
    onPaginationChange
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useListClientUserFeatureTranslations();

    // Unmask client user fragment
    const clientUsers = useFragment(ListUserFeatureFragment_clientUser, clientUsersFragmentRef);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Generate roles column content with CountBadgeElement
     */
    const generateRolesColumn = (row: TableRowData) => {
        const roles = row.rolesData as Array<{ code: string }> | undefined;
        const translatedRoles = roles?.map(role => common(role.code as CommonTranslationKey)) || [];

        return (
            <CountBadgeElement
                items={translatedRoles}
                popoverId={`roles-popover-${row.id}`}
            />
        );
    };

    /**
     * Generate status column content with badge
     */
    const generateStatusColumn = (row: TableRowData) => {
        const statusCode = (row.statusCode || "unknown") as UserStatusCode | "unknown";
        const statusInfo = userStatusConfig[statusCode] || userStatusConfig.unknown;

        return (
            <BadgeElement bg={statusInfo.variant}>
                {t(statusInfo.translationKey as any)}
            </BadgeElement>
        );
    };

    /**
     * Generate isLicensed column content with badge
     */
    const generateIsLicensedColumn = (row: TableRowData) => {
        const isLicensed = row.isLicensed as boolean;

        return (
            <BadgeElement bg={isLicensed ? "success" : "secondary"}>
                {isLicensed ? t("licensed") : t("notLicensed")}
            </BadgeElement>
        );
    };

    /**
     * Client users table columns (12 columns per breakpoint)
     */
    const columns = useMemo<TableColumn[]>(() => [
        {
            dataName: "emailAddress",
            label: t("emailColumn"),
            xs: "d-none",
            sm: 4,          // sm: 4 + 4 + 2 = 10 (actions: 2) = 12
            md: 4,          // md: 3 + 2 + 2 + 2 + 1 = 10 (actions: 1) = 12
            lg: 3,          // lg: 3 + 2 + 2 + 1 + 1 + 2 + 1 = 12
            xl: 3           // xl: 3 + 2 + 2 + 1 + 1 + 2 + 1 = 12
        },
        {
            dataName: "fullName",
            label: t("nameColumn"),
            xs: 6,          // xs: 6 + 6 = 12
            sm: 4,
            md: 2,
            lg: 2,
            xl: 2
        },
        {
            dataName: "clientName",
            label: t("clientColumn"),
            xs: 6,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2
        },
        {
            dataName: "statusCode",
            label: t("statusColumn"),
            generator: generateStatusColumn,
            xs: "d-none",
            sm: "d-none",
            md: 2,
            lg: 1,
            xl: 1
        },
        {
            dataName: "roles",
            label: t("rolesColumn"),
            generator: generateRolesColumn,
            xs: "d-none",
            sm: "d-none",
            md: "d-none",
            lg: 1,
            xl: 1
        },
        {
            dataName: "isLicensed",
            label: t("isLicensedColumn"),
            generator: generateIsLicensedColumn,
            xs: "d-none",
            sm: "d-none",
            md: "d-none",
            lg: 2,
            xl: 2
        }
    ], [t, common, generateStatusColumn, generateIsLicensedColumn]);

    /**
     * Transform client user data to table row data
     * Data is now directly on UserNode (not nested in .user)
     */
    const tableData = useMemo<TableRowData[]>(() => {
        if (!clientUsers || clientUsers.length === 0) return [];

        return clientUsers.map((clientUser: typeof clientUsers[number]) => {
            // Full name
            const firstName = clientUser.privateData?.firstName || "";
            const lastName = clientUser.privateData?.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || "-";

            return {
                id: clientUser.id,
                emailAddress: clientUser.emailAddress?.address || "-",
                fullName: fullName,
                clientName: clientUser.client?.name || "-",
                statusCode: clientUser.status?.code || "unknown",
                rolesData: clientUser.organizationRoles || [],
                isLicensed: clientUser.isLicensed
            };
        });
    }, [clientUsers]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <ListFeature
            columns={columns}
            data={tableData}
            actionGenerator={actionGenerator}
            actionColumnLabel={t("actionsColumn")}
            pageInfo={pageInfo}
            itemsPerPage={itemsPerPage}
            emptyMessage={t("noData")}
            onPaginationChange={onPaginationChange}
        />
    );
};

ListClientUserFeature.displayName = "ListClientUserFeature";

export default ListClientUserFeature;