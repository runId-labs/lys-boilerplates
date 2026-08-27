import React from "react";
import {PageProps} from "lys-front/types";
import ListClientUserRestricted from "@/components/restrictedFeatures/ListClientUserRestricted";

/**
 * ListClientUserPage component
 *
 * Page for managing client users list with search and filter functionality
 */
const ListClientUserPage: React.FC<PageProps> = () => {
    return <ListClientUserRestricted />;
};

ListClientUserPage.displayName = "ListClientUserPage";

export default ListClientUserPage;
