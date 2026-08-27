import * as React from "react";
import {useEffect, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useIntl} from "react-intl";
import {useConnectedUserInfo} from "lys-front/providers";
import {RouteInterface} from "lys-front/types";
import {useRouteInfo} from "lys-front/providers";
import {generateUrlByRoute} from "lys-front/tools";
import {Container, Row, Col, Breadcrumb} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./PrivateAppTemplate.scss";

interface PrivateAppTemplateProps {
    route: RouteInterface
    defaultPrivateRoute: RouteInterface
    defaultPublicRoute: RouteInterface
    children: React.ReactNode
    navbar?: React.ReactNode
    sidebar?: React.ReactNode
}

const PrivateAppTemplate: React.ComponentType<PrivateAppTemplateProps> = (
    {
        route,
        defaultPublicRoute,
        children,
        navbar,
        sidebar
    }) => {

    const navigate = useNavigate();
    const params = useParams();
    const intl = useIntl();
    const {user} = useConnectedUserInfo();
    const {getRouteByName} = useRouteInfo();

    const breadcrumbItems = useMemo(() => {
        if (!route.breadcrumbs || route.breadcrumbs.length === 0) {
            return [];
        }
        return route.breadcrumbs
            .map((routeName) => {
                const breadcrumbRoute = getRouteByName(routeName);
                if (!breadcrumbRoute) return null;
                const url = generateUrlByRoute(breadcrumbRoute, params as Record<string, string>);
                const label = intl.formatMessage({id: breadcrumbRoute.transPrefix + "pageName"});
                return { label, path: url };
            })
            .filter((item): item is {label: string; path: string} => item !== null);
    }, [route.breadcrumbs, getRouteByName, params, intl]);

    const currentPageLabel = useMemo(() => {
        return intl.formatMessage({id: route.transPrefix + "pageName"});
    }, [route.transPrefix, intl]);

    useEffect(() => {
        if (!user) {
            navigate(defaultPublicRoute.path);
        }
    }, [user, defaultPublicRoute.path, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="private-app-template">
            {navbar}
            <Container fluid className="h-100 p-0">
                <Row className="h-100">
                    {sidebar}
                    <Col className="content-column">
                        <Breadcrumb className="breadcrumbs-element">
                            {breadcrumbItems.map((item, index) => (
                                <Breadcrumb.Item
                                    key={`breadcrumb-${index}`}
                                    linkAs={Link}
                                    linkProps={{to: item.path}}
                                >
                                    {item.label}
                                </Breadcrumb.Item>
                            ))}
                            <Breadcrumb.Item active>
                                {currentPageLabel}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PrivateAppTemplate;
