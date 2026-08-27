import React from "react";
import {PageProps} from "lys-front/types";
import ListAdminRestricted from "@/components/restrictedFeatures/ListAdminRestricted";

/**
 * ListAdminPage component
 *
 * Page for managing admins/internal users list with search and filter functionality
 */
const ListAdminPage: React.FC<PageProps> = () => {
    return <ListAdminRestricted />;
};

ListAdminPage.displayName = "ListAdminPage";

export default ListAdminPage;
