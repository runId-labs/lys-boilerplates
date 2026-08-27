import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SSOButtonsFeatureProps, SSOProvider} from "./types";
import {useSSOButtonsTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SSOButtonsFeatureQuery} from "./__generated__/SSOButtonsFeatureQuery.graphql";

/**
 * GraphQL query for SSO providers
 */
const SSOProvidersQuery = graphql`
    query SSOButtonsFeatureQuery {
        ssoProviders {
            providers {
                providerId
                name
                loginUrl
            }
        }
    }
`;

/**
 * Icon mapping for known SSO providers
 */
const providerIcons: Record<string, string> = {
    microsoft: "bi-microsoft",
    google: "bi-google",
};

/**
 * SSOButtonsFeature component
 *
 * Fetches configured SSO providers and renders login/signup buttons.
 * Each button links to the SSO authorization flow with the appropriate mode.
 *
 * Uses LysQueryProvider for the public ssoProviders query.
 */
const SSOButtonsFeature: React.FC<SSOButtonsFeatureProps> = ({
    mode,
    dividerPosition = "before",
    className = ""
}) => {

    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useSSOButtonsTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    const dividerText = useMemo(() => {
        if (mode === "login") return t("dividerLogin");
        if (mode === "signup") return t("dividerSignup");
        return t("dividerLink");
    }, [mode, t]);

    const providers: SSOProvider[] = useMemo(() => {
        const data = queryRef?.data as SSOButtonsFeatureQuery["response"] | undefined;
        if (!data?.ssoProviders?.providers) return [];

        return data.ssoProviders.providers.map((p) => ({
            providerId: p.providerId,
            name: p.name,
            loginUrl: p.loginUrl,
        }));
    }, [queryRef?.data]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
            queryRef?.load();
        }
    }, [queryRef?.hasPermission, queryRef?.load]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={SSOProvidersQuery}
            ref={setQueryRef}
            as="div"
        >
            {providers.length > 0 && (
                <div className={`d-flex flex-column gap-2 ${className}`}>
                    {dividerPosition === "before" && (
                        <div className="d-flex align-items-center gap-2 my-2">
                            <hr className="flex-grow-1"/>
                            <span className="text-muted small">{dividerText}</span>
                            <hr className="flex-grow-1"/>
                        </div>
                    )}
                    {providers.map((provider) => {
                        const icon = providerIcons[provider.providerId] || "bi-box-arrow-in-right";

                        // Validate that loginUrl points to a legitimate SSO path
                        try {
                            const url = new URL(provider.loginUrl, window.location.origin);
                            if (!url.pathname.startsWith("/auth/sso/")) return null;
                        } catch {
                            return null;
                        }

                        const href = `${provider.loginUrl}?mode=${mode}`;

                        return (
                            <a
                                key={provider.providerId}
                                href={href}
                                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                            >
                                <i className={`bi ${icon}`}></i>
                                {provider.name}
                            </a>
                        );
                    })}
                    {dividerPosition === "after" && (
                        <div className="d-flex align-items-center gap-2 my-2">
                            <hr className="flex-grow-1"/>
                            <span className="text-muted small">{dividerText}</span>
                            <hr className="flex-grow-1"/>
                        </div>
                    )}
                </div>
            )}
        </LysQueryProvider>
    );
};

SSOButtonsFeature.displayName = "SSOButtonsFeature";

export default SSOButtonsFeature;
