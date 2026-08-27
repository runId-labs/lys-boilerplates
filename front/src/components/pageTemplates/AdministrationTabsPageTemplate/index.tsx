import {PageTemplate} from "lys-front/types";
import TabsNavigationFeature from "@/components/features/TabsNavigationFeature";
import {ADMINISTRATION_TABS} from "@/services/navigation/administrationTabs";
import "./styles.scss";

/**
 * Page template shared by every Administration page (ClientAdmin, ListClientUser,
 * ListCompany, ListEstablishment, ListCompanyTag). Provides the administration
 * tabs bar at the top — each tab is a real route, navigation is a full page
 * load. Each page keeps its own internal filters/queries.
 */
const AdministrationTabsPageTemplate: PageTemplate = ({route}) => {
    return (
        <div className="administration-tabs-page-template">
            <TabsNavigationFeature tabs={ADMINISTRATION_TABS} />
            <route.component route={route} />
        </div>
    );
};

export default AdministrationTabsPageTemplate;
