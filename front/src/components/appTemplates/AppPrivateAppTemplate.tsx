import * as React from "react";
import {Col} from "react-bootstrap";
import {RouteInterface} from "lys-front/types";
import NavBarFeature from "@/components/features/NavBarFeature";
import SidebarMenuFeature from "@/components/features/SidebarMenuFeature";
import {useChatbot} from "lys-front/providers";
import PrivateAppTemplate from "./PrivateAppTemplate";

interface AppPrivateAppTemplateProps {
    route: RouteInterface
    defaultPrivateRoute: RouteInterface
    defaultPublicRoute: RouteInterface
    children: React.ReactNode
}

/**
 * App-specific private app template
 * Injects NavBarFeature, SidebarMenuFeature and chatbot-dependent sidebar class
 * into the generic PrivateAppTemplate.
 */
const AppPrivateAppTemplate: React.ComponentType<AppPrivateAppTemplateProps> = (
    {
        route,
        defaultPublicRoute,
        defaultPrivateRoute,
        children
    }) => {

    const {isChatbotMode} = useChatbot();

    return (
        <PrivateAppTemplate
            route={route}
            defaultPublicRoute={defaultPublicRoute}
            defaultPrivateRoute={defaultPrivateRoute}
            navbar={<NavBarFeature key="navbar" />}
            sidebar={
                <Col className={`p-0 sidebar-column-container ${isChatbotMode ? 'chatbot-mode' : ''}`}>
                    <SidebarMenuFeature key="sidebar" />
                </Col>
            }
        >
            {children}
        </PrivateAppTemplate>
    );
};

export default AppPrivateAppTemplate;
