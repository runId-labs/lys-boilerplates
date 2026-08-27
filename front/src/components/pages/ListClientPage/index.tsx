import React from "react";
import {PageProps} from "lys-front/types";
import ListClientRestricted from "@/components/restrictedFeatures/ListClientRestricted";

/**
 * ListClientPage
 * Administration section page - displays list of all clients with search functionality
 */
const ListClientPage: React.FC<PageProps> = () => {
    return <ListClientRestricted />;
};

ListClientPage.displayName = "ListClientPage";

export default ListClientPage;
