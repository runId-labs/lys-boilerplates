import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {graphql} from "react-relay";
import {
    AcceptFounderCustomerRestrictedProps,
    AcceptFounderCustomerRestrictedRefInterface
} from "./types";
import {useAcceptFounderCustomerRestrictedTranslations} from "./translations";
import {useAlertMessages} from "lys-front/providers";
import {useLocale} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import CheckboxElement from "@/components/elements/CheckboxElement";
import type {AcceptFounderCustomerRestrictedQuery} from "./__generated__/AcceptFounderCustomerRestrictedQuery.graphql";

/**
 * Legal document type code of the programme
 */
const FOUNDER_CUSTOMER = "FOUNDER_CUSTOMER";

/**
 * GraphQL query for the version of the programme currently in force
 *
 * The acceptance is recorded against a version, never against the type: that is
 * what makes it a proof — it says which text was agreed to, on a day the text
 * may since have changed.
 */
const CurrentFounderCustomerQuery = graphql`
    query AcceptFounderCustomerRestrictedQuery($typeId: String!, $languageId: String!) {
        currentLegalDocument(typeId: $typeId, languageId: $languageId) {
            id
            versionNumber
        }
    }
`;

/**
 * GraphQL mutation recording the acceptance
 */
const AcceptFounderCustomerMutation = graphql`
    mutation AcceptFounderCustomerRestrictedMutation($versionId: ID!) {
        acceptLegalDocument(versionId: $versionId) {
            id
        }
    }
`;

/**
 * AcceptFounderCustomerRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - The Founder Customer programme, its terms and the link to the document
 * - The client's acceptance, recorded as proof against the version in force
 *
 * The acceptance is taken here, from the client themselves, and not later from
 * the administrator who grants the discount: nobody can accept a contract on
 * someone else's behalf, and the proof is what the programme is exchanged for.
 */
const AcceptFounderCustomerRestricted = forwardRef<
    AcceptFounderCustomerRestrictedRefInterface,
    AcceptFounderCustomerRestrictedProps
>(({onChange}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useAcceptFounderCustomerRestrictedTranslations();
    const {locale} = useLocale();
    const alertMessage = useAlertMessages();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface<AcceptFounderCustomerRestrictedQuery> | null>(null);
    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
    const [accepted, setAccepted] = useState<boolean>(false);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle the client ticking or unticking the programme
     */
    const handleChange = useCallback((value: boolean) => {
        setAccepted(value);
        onChange?.(value);
    }, [onChange]);

    /**
     * Record the acceptance against the version in force
     */
    const accept = useCallback((): Promise<boolean> => {
        if (!accepted) return Promise.resolve(true);

        const versionId = queryRef?.data?.currentLegalDocument?.id;

        if (!versionId || !mutationRef?.commit) {
            alertMessage.merge([{text: t("error"), level: "ERROR"}]);
            return Promise.resolve(false);
        }

        const commit = mutationRef.commit;

        return new Promise<boolean>((resolve) => {
            commit({
                variables: {versionId},
                onCompleted: () => resolve(true),
                onError: () => {
                    alertMessage.merge([{text: t("error"), level: "ERROR"}]);
                    resolve(false);
                }
            });
        });
    }, [accepted, queryRef?.data, mutationRef, alertMessage, t]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Auto-load the version in force
     */
    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef?.data) {
            queryRef?.load();
        }
    }, [queryRef?.hasPermission, queryRef?.isLoading, queryRef?.data, queryRef?.load]);

    /**
     * Expose the acceptance to the parent
     */
    useImperativeHandle(ref, () => ({
        accepted,
        accept
    }), [accepted, accept]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={CurrentFounderCustomerQuery}
            parameters={{typeId: FOUNDER_CUSTOMER, languageId: locale}}
            ref={setQueryRef}
        >
            <LysMutationProvider
                mutation={AcceptFounderCustomerMutation}
                ref={setMutationRef}
            >
                {/* Nothing is offered while the document is not published: a
                    programme without terms cannot be accepted */}
                {queryRef?.data?.currentLegalDocument && (
                    <CardElement variant="flat" padding="lg">
                        <div className="text-muted small mb-2">{t("title")}</div>
                        <p className="mb-3">{t("explanation")}</p>

                        <CheckboxElement
                            id="accept-founder-customer"
                            label={t("acceptLabel")}
                            value={accepted}
                            onChange={handleChange}
                            className="mb-2"
                        />

                        <a
                            href={`/legal/${FOUNDER_CUSTOMER}/${locale}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t("linkText")}
                        </a>
                    </CardElement>
                )}
            </LysMutationProvider>
        </LysQueryProvider>
    );
});

AcceptFounderCustomerRestricted.displayName = "AcceptFounderCustomerRestricted";

export default AcceptFounderCustomerRestricted;
