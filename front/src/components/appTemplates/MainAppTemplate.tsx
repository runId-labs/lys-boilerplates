import * as React from "react";
import {RouteInterface} from "lys-front/types";
import {RouterAppTemplate} from "./RouterAppTemplate";
import {
    AlertMessageProvider,
    ErrorBoundaryProvider,
    ConnectedUserProvider,
    WebserviceAccessProvider,
    LocaleProvider,
    ChatbotProvider,
    SignalProvider,
    PageContextProvider,
    useAlertMessages,
    LysLoadingContext,
} from "lys-front/providers";
import type {AlertGeneratorFunction} from "lys-front/providers";
import {lysMessages} from "@/services/i18n/messages";


interface MainAppTemplateProps {
    routes: RouteInterface[];
    defaultLocale: string;
    defaultPublicRoute: RouteInterface;
    defaultPrivateRoute: RouteInterface;
    alertGenerator: AlertGeneratorFunction;
}

export const MainAppTemplate: React.ComponentType<MainAppTemplateProps> = (
    {
        routes,
        defaultLocale,
        defaultPublicRoute,
        defaultPrivateRoute,
        alertGenerator,
    }) => {

    const lysLoadingFallback = React.useMemo(() => ({
        loadingFallback: (
            <div className="lys-query-loading d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }), []);

    return(
        <LocaleProvider defaultLocale={defaultLocale} messageSources={lysMessages}>
            <LysLoadingContext.Provider value={lysLoadingFallback}>
            <AlertMessageProvider
                alertGenerator={alertGenerator}
            >
                <ErrorBoundaryWrapper>
                    <ConnectedUserProvider>
                        <WebserviceAccessProvider>
                            <SignalProvider>
                                <PageContextProvider>
                                    <ChatbotProvider>
                                        <RouterAppTemplate
                                            routes={routes}
                                            defaultPublicRoute={defaultPublicRoute}
                                            defaultPrivateRoute={defaultPrivateRoute}
                                        />
                                    </ChatbotProvider>
                                </PageContextProvider>
                            </SignalProvider>
                        </WebserviceAccessProvider>
                    </ConnectedUserProvider>
                </ErrorBoundaryWrapper>
            </AlertMessageProvider>
            </LysLoadingContext.Provider>
        </LocaleProvider>
    );
};

const ErrorBoundaryWrapper: React.ComponentType<{children: React.ReactNode}> = ({ children }) => {
    const alertMessage = useAlertMessages();

    const handleError = (error: Error) => {
        alertMessage.merge([{
            text: error.message || "REACT_RENDER_ERROR",
            level: "CRITICAL"
        }]);
    };

    return (
        <ErrorBoundaryProvider onError={handleError}>
            {children}
        </ErrorBoundaryProvider>
    );
};
