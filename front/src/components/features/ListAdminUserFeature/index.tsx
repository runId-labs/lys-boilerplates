import React, {useMemo} from "react";
import {useFragment} from "react-relay";
import {ListAdminUserFeatureProps} from "./types";
import {ListUserFeatureFragment} from "@/components/features/ListUserFeature/ListUserFeatureFragment";
import {useListAdminUserFeatureTranslations} from "./translations";
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
 * ListAdminUserFeature component
 *
 * Autonomous feature component (Layer 2) for admin/internal users
 * - Manages GraphQL fragment
 * - Defines admin-specific columns (no client column)
 * - Transforms data
 * - Uses ListFeature for rendering
 */
const ListAdminUserFeature: React.FC<ListAdminUserFeatureProps> = ({
    adminUsersFragmentRef,
    pageInfo,
    itemsPerPage,
    actionGenerator,
    onPaginationChange
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useListAdminUserFeatureTranslations();

    // Unmask admin user fragment
    const adminUsers = useFragment(ListUserFeatureFragment, adminUsersFragmentRef);

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
     * Admin users table columns (12 columns per breakpoint)
     */
    const columns = useMemo<TableColumn[]>(() => [
        {
            dataName: "emailAddress",
            label: t("emailColumn"),
            xs: "d-none",
            sm: 5,
            md: 4,
            lg: 3,
            xl: 3
        },
        {
            dataName: "fullName",
            label: t("nameColumn"),
            xs: 9,
            sm: 5,
            md: 3,
            lg: 3,
            xl: 3
        },
        {
            dataName: "status",
            label: t("statusColumn"),
            xs: "d-none",
            sm: "d-none",
            md: 2,
            lg: 2,
            xl: 2
        },
        {
            dataName: "roles",
            label: t("rolesColumn"),
            generator: generateRolesColumn,
            xs: "d-none",
            sm: "d-none",
            md: 1,
            lg: 1,
            xl: 1
        },
        {
            dataName: "createdAt",
            label: t("createdAtColumn"),
            xs: "d-none",
            sm: "d-none",
            md: "d-none",
            lg: 2,
            xl: 2
        }
    ], [t, common]);

    /**
     * Transform admin user data to table row data
     */
    const tableData = useMemo<TableRowData[]>(() => {
        if (!adminUsers || adminUsers.length === 0) return [];

        return adminUsers.map((user: typeof adminUsers[number]) => {
            // Format date
            const createdDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-";

            // Status badge
            const statusCode = (user.status?.code || "unknown") as UserStatusCode | "unknown";
            const statusInfo = userStatusConfig[statusCode] || userStatusConfig.unknown;

            // Full name
            const firstName = user.privateData?.firstName || "";
            const lastName = user.privateData?.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || "-";

            return {
                id: user.id,
                emailAddress: user.emailAddress?.address || "-",
                fullName: fullName,
                status: (
                    <BadgeElement bg={statusInfo.variant}>
                        {t(statusInfo.translationKey as any)}
                    </BadgeElement>
                ),
                rolesData: user.roles || [],
                createdAt: createdDate
            };
        });
    }, [adminUsers, t]);

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

ListAdminUserFeature.displayName = "ListAdminUserFeature";

export default ListAdminUserFeature;