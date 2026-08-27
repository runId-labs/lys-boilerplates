import React from "react";
import {PageProps} from "lys-front/types";
import ListSuperUserRestricted from "@/components/restrictedFeatures/ListSuperUserRestricted";

/**
 * ListSuperUserPage component
 *
 * Page for managing super users list with search functionality
 */
const ListSuperUserPage: React.FC<PageProps> = () => {
    return <ListSuperUserRestricted />;
};

ListSuperUserPage.displayName = "ListSuperUserPage";

export default ListSuperUserPage;