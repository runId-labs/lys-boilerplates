import {PageTemplate} from "lys-front/types";
import TabsNavigationFeature from "@/components/features/TabsNavigationFeature";
import {SUPERVISION_TABS} from "@/services/navigation/supervisionTabs";
import "./styles.scss";

/**
 * Page template shared by every Supervision page (ListClient, ListAdmin,
 * ListSuperUser). Provides the supervision tabs bar at the top — each tab is
 * a real route, navigation is a full page load. Each page keeps its own
 * internal filters/queries.
 */
const SupervisionTabsPageTemplate: PageTemplate = ({route}) => {
    return (
        <div className="supervision-tabs-page-template">
            <TabsNavigationFeature tabs={SUPERVISION_TABS} />
            <route.component route={route} />
        </div>
    );
};

export default SupervisionTabsPageTemplate;
