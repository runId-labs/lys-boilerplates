import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {ManageUserSSORestrictedProps, SSOProviderLinkState} from "./types";
import {useManageUserSSORestrictedTranslations} from "./translations";
import {useIntl} from "react-intl";
import {useLysDialog} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import UnlinkUserSSORestricted from "@/components/restrictedFeatures/UnlinkUserSSORestricted";
import {ManageUserSSORestrictedQuery} from "./__generated__/ManageUserSSORestrictedQuery.graphql";

/**
 * GraphQL query combining configured SSO providers and the connected user's existing links.
 * `ssoProviders` is public, `mySsoLinks` requires the CONNECTED access level — both are
 * satisfied once the user is authenticated, so they can be fetched together.
 */
const ManageUserSSOQuery = graphql`
    query ManageUserSSORestrictedQuery {
        ssoProviders {
            providers {
                providerId
                name
                loginUrl
            }
        }
        mySsoLinks {
            links {
                id
                provider
                externalEmail
                linkedAt
            }
        }
    }
`;

/**
 * Icon mapping for known SSO providers
 */
const providerIcons: Record<string, string> = {
    microsoft: "bi-microsoft",
    google: "bi-google"
};

/**
 * ManageUserSSORestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - The list of configured SSO providers merged with the connected user's link state
 * - "Link" action navigating to the SSO authorization flow (mode=link)
 * - "Unlink" action opening a confirmation dialog (UnlinkUserSSORestricted)
 */
const ManageUserSSORestricted: React.FC<ManageUserSSORestrictedProps> = ({userId}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useManageUserSSORestrictedTranslations();
    const intl = useIntl();
    const {open} = useLysDialog();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<ManageUserSSORestrictedQuery> | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    const providers: SSOProviderLinkState[] = useMemo(() => {
        const data = queryRef?.data;
        const configuredProviders = data?.ssoProviders?.providers || [];
        const links = data?.mySsoLinks?.links || [];

        return configuredProviders.map((provider) => {
            const link = links.find((candidate) => candidate.provider === provider.providerId);
            return {
                providerId: provider.providerId,
                name: provider.name,
                loginUrl: provider.loginUrl,
                linkId: link?.id || null,
                externalEmail: link?.externalEmail || null,
                linkedAt: link?.linkedAt || null
            };
        });
    }, [queryRef?.data]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    // Reload rather than drop the row locally: the server stays the source of truth,
    // and a hidden-but-still-linked provider would survive reopening the panel.
    const handleUnlinked = useCallback(() => {
        queryRef?.load();
    }, [queryRef]);

    const handleUnlinkClick = useCallback((provider: SSOProviderLinkState) => {
        if (!provider.linkId) return;

        open({
            uniqueKey: `unlink-sso-${provider.providerId}`,
            title: t("dialogTitle"),
            body: UnlinkUserSSORestricted,
            bodyProps: {
                linkId: provider.linkId,
                providerName: provider.name,
                accessParameters: {ownerIds: [userId]},
                onCompleted: handleUnlinked
            },
            placement: "end",
            size: "sm"
        });
    }, [open, t, userId, handleUnlinked]);

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
            query={ManageUserSSOQuery}
            ref={setQueryRef}
        >
            {queryRef?.hasPermission && (
                <CardElement
                    variant="flat"
                    padding="lg"
                    header={<h6 className="mb-0">{t("title")}</h6>}
                    footer={
                        <p className="text-muted small mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            {t("description")}
                        </p>
                    }
                >
                    {providers.length === 0 && (
                        <p className="text-muted small mb-0">{t("empty")}</p>
                    )}
                    <div className="d-flex flex-column gap-2">
                        {providers.map((provider) => {
                            const icon = providerIcons[provider.providerId] || "bi-box-arrow-in-right";

                            // The login URL comes from the API, which builds it from a
                            // configured base. Checking the path alone would pass an
                            // absolute URL to another host, since `new URL` ignores the
                            // base when the value is absolute — so the origin is checked
                            // too, and a mismatch simply offers no link.
                            let href: string | null = null;
                            try {
                                const url = new URL(provider.loginUrl, window.location.origin);
                                if (url.origin === window.location.origin
                                    && url.pathname.startsWith("/auth/sso/")) {
                                    href = `${provider.loginUrl}?mode=link`;
                                }
                            } catch {
                                href = null;
                            }

                            return (
                                <div
                                    key={provider.providerId}
                                    className="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom"
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <i className={`bi ${icon}`}></i>
                                        <div>
                                            <div>{provider.name}</div>
                                            {provider.linkId && (
                                                <div className="text-success small">
                                                    <i className="bi bi-check-circle-fill me-1"></i>
                                                    {t("linked")}
                                                    {provider.linkedAt && (
                                                        <> — {t("linkedSince")} {intl.formatDate(provider.linkedAt, {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        })}</>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {provider.linkId ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleUnlinkClick(provider)}
                                        >
                                            {t("unlinkButton")}
                                        </button>
                                    ) : (
                                        href && (
                                            <a href={href} className="btn btn-outline-secondary btn-sm">
                                                {t("linkButton")}
                                            </a>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardElement>
            )}
        </LysQueryProvider>
    );
};

ManageUserSSORestricted.displayName = "ManageUserSSORestricted";

export default ManageUserSSORestricted;
