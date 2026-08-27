import * as React from "react";
import {RouteInterface} from "lys-front/types";
import {useMemo} from "react";
import {generateRouteFromDescription} from "lys-front/tools";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import EmptyPageTemplate from "../pageTemplates/EmptyPageTemplate";
import {notFoundDefaultPage} from "../pages/NotFoundDefaultPage/config";
import AppPrivateAppTemplate from "./AppPrivateAppTemplate";
import {
    UrlQueriesProvider,
    ClientProvider,
    LysDialogProvider,
    FilterLabelsProvider,
    RouteProvider
} from "lys-front/providers";
import type {DialogConfig} from "lys-front/providers";
import OffCanvasElement from "../elements/OffCanvasElement";
import ChatbotDialogButtonFeature from "../features/ChatbotDialogButtonFeature";
import DialogScopedUrlProvider from "../providers/DialogScopedUrlProvider";

interface Props {
    routes: RouteInterface[],
    defaultPublicRoute: RouteInterface
    defaultPrivateRoute: RouteInterface
    notFoundPageRoute?: RouteInterface | undefined
}

/**
 * Router template
 * Mounts all application routes and handles routing configuration
 */
export const RouterAppTemplate: React.ComponentType<Props> = (
    {
        routes,
        defaultPublicRoute,
        defaultPrivateRoute,
        // 404 Page configuration
        notFoundPageRoute
    }) => {

    const effectiveNotFoundPageRoute = useMemo(() => {
        if (notFoundPageRoute !== undefined) {
            return notFoundPageRoute;
        }
        else {
            return generateRouteFromDescription(notFoundDefaultPage)
        }
    }, [notFoundPageRoute])

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return(
        <BrowserRouter>
            <UrlQueriesProvider>
                <ClientProvider routes={routes}>
                    <FilterLabelsProvider>
                        <LysDialogProvider
                            dialogComponent={OffCanvasElement}
                            loadingFallback={
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            }
                            backIcon={<i className="bi bi-arrow-left fs-5"></i>}
                            renderExtra={(current: DialogConfig) => (
                                <ChatbotDialogButtonFeature current={current} />
                            )}
                        >
                            <DialogScopedUrlProvider>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/login" replace />} />
                                    {
                                        routes.map(route => {
                                            const pageTemplate = {
                                                template: route.template ?? EmptyPageTemplate
                                            }

                                            return (
                                                <Route
                                                    path={route.path}
                                                    key={route.name}
                                                    element={
                                                        <RouteProvider
                                                            route={route}
                                                            routes={routes}
                                                            defaultPublicRoute={defaultPublicRoute}
                                                            defaultPrivateRoute={defaultPrivateRoute}
                                                            privateTemplate={AppPrivateAppTemplate}
                                                        >
                                                            <pageTemplate.template route={route}/>
                                                        </RouteProvider>
                                                    }
                                                />
                                            )

                                        })
                                    }

                                    {effectiveNotFoundPageRoute &&
                                        <>
                                            <Route
                                                path={effectiveNotFoundPageRoute.path}
                                                element={
                                                    <EmptyPageTemplate route={effectiveNotFoundPageRoute}/>
                                                }
                                            />
                                            <Route
                                                path={'*'}
                                                element={
                                                    <Navigate to={effectiveNotFoundPageRoute.path} />
                                                }
                                            />
                                            <Route
                                                element={
                                                    <Navigate to={effectiveNotFoundPageRoute.path} />
                                                }
                                            />
                                        </>
                                    }
                                </Routes>
                            </DialogScopedUrlProvider>
                        </LysDialogProvider>
                    </FilterLabelsProvider>
                </ClientProvider>
            </UrlQueriesProvider>
        </BrowserRouter>
    );
};
