import React, {useMemo} from "react";
import {ListUserFeatureProps, NormalizedUserData} from "./types";
import {useListUserFeatureTranslations, ListUserFeatureTranslationKey} from "./translations";
import {CommonTranslationKey} from "@/services/i18n/common";
import BadgeElement from "@/components/elements/BadgeElement";
import ListFeature from "@/components/features/ListFeature";
import {TableColumn, TableRowData} from "@/components/elements/TableElement/types";
import CountBadgeElement from "@/components/elements/CountBadgeElement";

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
 * ListUserFeature component
 *
 * Pure presentation component (Layer 2) that provides:
 * - Reusable user list display with table and pagination
 * - No GraphQL logic - receives normalized data from containers
 * - Handles UI rendering and user interactions
 *
 * This is a presentation component that:
 * - Receives normalized data (no fragment refs)
 * - Displays users in a responsive table
 * - Handles pagination display
 * - Receives action callbacks as props
 */
const ListUserFeature: React.FC<ListUserFeatureProps> = ({
    users,
    pageInfo,
    itemsPerPage,
    actionGenerator,
    showClientColumn = false,
    onPaginationChange
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useListUserFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Generate roles column content with CountBadgeElement
     */
    const generateRolesColumn = (row: TableRowData) => {
        const roles = row.rolesData as Array<{ code: string }> | undefined;

        // Transform role codes to translated strings
        const translatedRoles = roles?.map(role => common(role.code as CommonTranslationKey)) || [];

        return (
            <CountBadgeElement
                items={translatedRoles}
                popoverId={`roles-popover-${row.id}`}
            />
        );
    };

    /**
     * Table column configuration
     */
    const tableColumns = useMemo<TableColumn[]>(() => {
        const baseColumns: TableColumn[] = [
            {
                dataName: "emailAddress",
                label: t("emailColumn"),
                xs: "d-none",
                sm: 3,
                md: 2,
                lg: 2,
                xl: 2
            },
            {
                dataName: "fullName",
                label: t("nameColumn"),
                xs: 6,
                sm: 3,
                md: 2,
                lg: 2,
                xl: 2
            }
        ];

        // Add client column for client users
        if (showClientColumn) {
            baseColumns.push({
                dataName: "clientName",
                label: t("clientColumn"),
                xs: 6,
                sm: 3,
                md: 2,
                lg: 2,
                xl: 2
            });
        }

        baseColumns.push(
            {
                dataName: "status",
                label: t("statusColumn"),
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
                dataName: "createdAt",
                label: t("createdAtColumn"),
                xs: "d-none",
                sm: "d-none",
                md: "d-none",
                lg: 1,
                xl: 1
            }
        );

        return baseColumns;
    }, [t, showClientColumn]);

    /**
     * Transform normalized user data to table row data
     */
    const tableData = useMemo<TableRowData[]>(() => {
        if (!users || users.length === 0) return [];

        return users.map((user: NormalizedUserData) => {
            // Format date
            const createdDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-";

            // Status badge
            const statusCode = (user.statusCode || "unknown") as UserStatusCode | "unknown";
            const statusInfo = userStatusConfig[statusCode] || userStatusConfig.unknown;

            // Full name
            const fullName = `${user.firstName} ${user.lastName}`.trim() || "-";

            const rowData: TableRowData = {
                id: user.id,
                emailAddress: user.emailAddress || "-",
                fullName: fullName,
                status: (
                    <BadgeElement bg={statusInfo.variant}>
                        {t(statusInfo.translationKey as ListUserFeatureTranslationKey)}
                    </BadgeElement>
                ),
                rolesData: user.roles || [],
                createdAt: createdDate
            };

            // Add client name for client users
            if (showClientColumn) {
                rowData.clientName = user.clientName || "-";
            }

            return rowData;
        });
    }, [users, t, showClientColumn]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <ListFeature
            columns={tableColumns}
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

ListUserFeature.displayName = "ListUserFeature";

export default ListUserFeature;