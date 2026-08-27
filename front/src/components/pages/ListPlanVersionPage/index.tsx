import React from "react";
import ListPlanVersionRestricted from "@/components/restrictedFeatures/ListPlanVersionRestricted";

/**
 * ListPlanVersionPage component
 *
 * Page component (Layer 4) that renders the plan version list.
 * Administration section - requires appropriate permissions.
 */
const ListPlanVersionPage: React.FC = () => {
    return <ListPlanVersionRestricted />;
};

ListPlanVersionPage.displayName = "ListPlanVersionPage";

export default ListPlanVersionPage;
