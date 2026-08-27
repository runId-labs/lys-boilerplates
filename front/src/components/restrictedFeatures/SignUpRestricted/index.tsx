import {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {useIntl} from "react-intl";
import {useSearchParams} from "react-router-dom";
import {SignUpRestrictedProps} from "./types";
import {LysMutationProvider} from "lys-front/providers";
import {LysQueryProvider} from "lys-front/providers";
import {HasPermissionRefInterface, LysMutationRefInterface} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useLysDialog} from "lys-front/providers";
import {useSignUpRestrictedTranslations} from "./translations";
import CardElement from "@/components/elements/CardElement";
import CheckboxElement from "@/components/elements/CheckboxElement";
import ButtonElement from "@/components/elements/ButtonElement";
import FormFeature from "@/components/features/FormFeature";
import SSOButtonsFeature from "@/components/features/SSOButtonsFeature";
import {FormSection} from "@/components/features/FormFeature/types";
import SelectLanguageRestricted from "@/components/restrictedFeatures/SelectLanguageRestricted";
import SelectGenderRestricted from "@/components/restrictedFeatures/SelectGenderRestricted";
import {validators} from "lys-front/tools";
import {SignUpRestrictedSSOSessionQuery} from "./__generated__/SignUpRestrictedSSOSessionQuery.graphql";

/**
 * GraphQL mutation for client registration
 */
const CreateClientMutation = graphql`
  mutation SignUpRestrictedMutation($inputs: CreateClientInput!) {
    createClient(inputs: $inputs) {
      id
      name
      ownerId
      createdAt
    }
  }
`;

/**
 * GraphQL mutation for SSO-based client registration (no password)
 */
const CreateClientWithSSOMutation = graphql`
  mutation SignUpRestrictedSSOMutation($inputs: CreateClientWithSSOInput!) {
    createClientWithSso(inputs: $inputs) {
      id
      name
      ownerId
      createdAt
    }
  }
`;

/**
 * GraphQL query for SSO session data (pre-fill signup form)
 */
const SSOSessionQuery = graphql`
  query SignUpRestrictedSSOSessionQuery($token: String!) {
    ssoSession(token: $token) {
      email
      firstName
      lastName
      provider
    }
  }
`;

/**
 * Consent checkbox for signup, rendered through FormFeature's `custom` slot.
 *
 * A single clickwrap box whose label links to the terms of use (actively accepted, recorded as
 * proof server-side) and the privacy policy (acknowledged — a notice, not a contract). The
 * document language follows the signup language selector (`formValues.languageCode`, default
 * "fr"), so the link points to the exact version the acceptance will be recorded against.
 */
const LegalConsentCheckbox = ({
    id,
    value,
    onChange,
    disabled,
    error,
    formValues,
}: {
    id?: string;
    value?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    error?: string;
    formValues?: {languageCode?: string};
}) => {
    const {t} = useSignUpRestrictedTranslations();
    const language = formValues?.languageCode || "fr";
    return (
        <CheckboxElement
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
            required
            label={
                <>
                    {t("consentIAccept")}{" "}
                    <a href={`/legal/TERMS_OF_USE/${language}`} target="_blank" rel="noopener noreferrer">
                        {t("termsLinkText")}
                    </a>
                    {" "}{t("consentAndAcknowledge")}{" "}
                    <a href={`/legal/PRIVACY_POLICY/${language}`} target="_blank" rel="noopener noreferrer">
                        {t("privacyLinkText")}
                    </a>
                    .
                </>
            }
        />
    );
};

/**
 * SignUpRestricted component
 *
 * Permission-protected client registration feature.
 * - Uses LysMutationProvider with createClient mutation
 * - Shows SignUpFeature if permission granted
 * - Handles success/error alerts via AlertMessageProvider
 * - Closes dialog on success
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps permission checking logic
 * - Manages GraphQL mutations
 * - Handles mutation lifecycle (onCompleted, onError)
 * - Exposes hasPermission via ref
 */
const SignUpRestricted = forwardRef<HasPermissionRefInterface, SignUpRestrictedProps>(
    ({}, ref) => {

        /*******************************************************************************************************************
         *                                                  HOOKS
         ******************************************************************************************************************/

        const dialog = useLysDialog();
        const {t} = useSignUpRestrictedTranslations();
        const intl = useIntl();
        const [searchParams, setSearchParams] = useSearchParams();

        /*******************************************************************************************************************
         *                                                  STATES
         ******************************************************************************************************************/

        const [innerRef, setInnerRef] = useState<LysMutationRefInterface | null>(null);
        const [ssoRef, setSsoRef] = useState<LysMutationRefInterface | null>(null);
        const [ssoQueryRef, setSsoQueryRef] = useState<LysQueryRefInterface | null>(null);

        // SSO token from URL
        const ssoToken = searchParams.get("sso_token");

        /*******************************************************************************************************************
         *                                                  MEMOS
         ******************************************************************************************************************/

        /**
         * Legal consent section (shared by the password and SSO signup forms).
         *
         * Single clickwrap checkbox: the user actively accepts the terms of use (recorded as proof
         * server-side) and is informed of the privacy policy (acknowledged, not consented — it is a
         * notice, not a contract). The label carries both documents as inline links, opened in a new
         * tab from the backend-served routes. The `validator` blocks submission while unchecked
         * (FormFeature's `required` treats `false` as filled), mirrored by the server enforcement.
         */
        const consentSection: FormSection = useMemo<FormSection>(() => ({
            uniqueKey: "signup-consent",
            title: t("consentSection"),
            controls: [
                {
                    label: "",
                    type: "custom" as const,
                    valueKey: "acceptedTermsOfUse",
                    required: true,
                    validator: {
                        method: (value: unknown) => value === true,
                        errorMessage: t("consentError"),
                    },
                    customComponent: LegalConsentCheckbox,
                    xs: 12,
                },
            ],
        }), [t]);

        /**
         * Form sections configuration
         */
        const formSections: FormSection[] = useMemo<FormSection[]>(() => [
            {
                uniqueKey: "signup-private-data",
                title: t("privateDataSection"),
                controls: [
                    {
                        label: t("firstName"),
                        type: "text" as const,
                        valueKey: "firstName",
                        isFloatingLabel: true,
                        xs: 12,
                    },
                    {
                        label: t("lastName"),
                        type: "text" as const,
                        valueKey: "lastName",
                        isFloatingLabel: true,
                        xs: 12,
                    },
                    {
                        label: "",
                        type: "custom" as const,
                        valueKey: "genderCode",
                        customComponent: SelectGenderRestricted,
                        customProps: {
                            isFloatingLabel: true,
                            nullable: true,
                        },
                        xs: 6,
                    },
                    {
                        label: "",
                        type: "custom" as const,
                        valueKey: "languageCode",
                        customComponent: SelectLanguageRestricted,
                        customProps: {
                            isFloatingLabel: true,
                            required: true,
                        },
                        xs: 6,
                    },
                ],
            },
            {
                uniqueKey: "signup-structure",
                title: t("structureSection"),
                controls: [
                    {
                        label: t("clientName"),
                        type: "text" as const,
                        valueKey: "clientName",
                        isFloatingLabel: true,
                        required: true,
                        xs: 12,
                    },
                ],
            },
            {
                uniqueKey: "signup-account",
                title: t("accountSection"),
                controls: [
                    {
                        label: t("email"),
                        type: "email" as const,
                        valueKey: "email",
                        isFloatingLabel: true,
                        required: true,
                        validator: validators.email(t("emailError")),
                        xs: 12,
                    },
                    {
                        label: t("password"),
                        type: "password_edit" as const,
                        valueKey: "password",
                        isFloatingLabel: true,
                        required: true,
                        xs: 12,
                    },
                ],
            },
            consentSection,
        ], [t, consentSection]);

        /**
         * SSO session data from query
         */
        const ssoSessionData = useMemo(() => {
            const data = ssoQueryRef?.data as SignUpRestrictedSSOSessionQuery["response"] | undefined;
            return data?.ssoSession ?? null;
        }, [ssoQueryRef?.data]);

        /**
         * SSO form sections (no password, email read-only)
         */
        const ssoFormSections: FormSection[] = useMemo<FormSection[]>(() => [
            {
                uniqueKey: "signup-private-data",
                title: t("privateDataSection"),
                controls: [
                    {
                        label: t("firstName"),
                        type: "text" as const,
                        valueKey: "firstName",
                        isFloatingLabel: true,
                        disabled: !!ssoSessionData?.firstName,
                        xs: 12,
                    },
                    {
                        label: t("lastName"),
                        type: "text" as const,
                        valueKey: "lastName",
                        isFloatingLabel: true,
                        disabled: !!ssoSessionData?.lastName,
                        xs: 12,
                    },
                    {
                        label: "",
                        type: "custom" as const,
                        valueKey: "genderCode",
                        customComponent: SelectGenderRestricted,
                        customProps: {
                            isFloatingLabel: true,
                            nullable: true,
                        },
                        xs: 6,
                    },
                    {
                        label: "",
                        type: "custom" as const,
                        valueKey: "languageCode",
                        customComponent: SelectLanguageRestricted,
                        customProps: {
                            isFloatingLabel: true,
                            required: true,
                        },
                        xs: 6,
                    },
                ],
            },
            {
                uniqueKey: "signup-structure",
                title: t("structureSection"),
                controls: [
                    {
                        label: t("clientName"),
                        type: "text" as const,
                        valueKey: "clientName",
                        isFloatingLabel: true,
                        required: true,
                        xs: 12,
                    },
                ],
            },
            {
                uniqueKey: "signup-account",
                title: t("accountSection"),
                controls: [
                    {
                        label: t("email"),
                        type: "email" as const,
                        valueKey: "email",
                        isFloatingLabel: true,
                        required: true,
                        disabled: true,
                        xs: 12,
                    },
                ],
            },
            consentSection,
        ], [t, ssoSessionData, consentSection]);

        /**
         * Initial form values
         */
        const initParameters = useMemo(() => ({
            languageCode: intl.locale,
            firstName: "",
            lastName: "",
            genderCode: "",
            email: "",
            password: "",
            clientName: "",
            acceptedTermsOfUse: false,
        }), [intl.locale]);

        /**
         * SSO pre-filled initial form values
         */
        const ssoInitParameters = useMemo(() => ({
            languageCode: intl.locale,
            firstName: ssoSessionData?.firstName || "",
            lastName: ssoSessionData?.lastName || "",
            genderCode: "",
            email: ssoSessionData?.email || "",
            clientName: "",
            acceptedTermsOfUse: false,
        }), [intl.locale, ssoSessionData]);

        /**
         * Show welcome dialog after successful registration
         */
        const showWelcomeDialog = useCallback(() => {
            dialog.open({
                uniqueKey: "sign-up-welcome",
                title: t("welcomeTitle"),
                placement: "end",
                size: "md",
                body: (
                    <CardElement
                        variant="flat"
                        padding="lg"
                    >
                        <div className="d-flex flex-column gap-3">
                            <div className="text-center">
                                <i className="bi bi-check-circle-fill text-success" style={{fontSize: "4rem"}}></i>
                            </div>
                            <p className="mb-0 fw-semibold text-center">{t("welcomeMessage")}</p>
                            <p className="mb-0">{t("welcomeLoginInfo")}</p>
                            <p className="mb-0 text-muted small">{t("welcomeEmailVerification")}</p>
                            <div className="d-grid">
                                <ButtonElement
                                    variant="primary"
                                    onClick={() => dialog.closeAll()}
                                >
                                    {t("welcomeClose")}
                                </ButtonElement>
                            </div>
                        </div>
                    </CardElement>
                ),
            });
        }, [dialog, t]);

        /**
         * Sign up dialog body (shared between openSignUpDialog and deep linking register)
         */
        const signUpDialogBody = useMemo(() => {
            if (!innerRef?.commit) return null;

            return (
                <CardElement
                    variant="flat"
                    padding="lg"
                >
                    <SSOButtonsFeature mode="signup" dividerPosition="after" />
                    <FormFeature
                        uniqueKey="signup-form"
                        sections={formSections}
                        submit={(parameters) => {
                            innerRef.commit?.({
                                variables: {
                                    inputs: {
                                        firstName: parameters.firstName || null,
                                        lastName: parameters.lastName || null,
                                        email: parameters.email,
                                        password: parameters.password,
                                        clientName: parameters.clientName,
                                        languageCode: parameters.languageCode,
                                        genderCode: parameters.genderCode || null,
                                        acceptedTermsOfUse: !!parameters.acceptedTermsOfUse,
                                    }
                                },
                                onCompleted: () => {
                                    showWelcomeDialog();
                                }
                            });
                        }}
                        isInFlight={innerRef.isInFlight}
                        initParameters={initParameters}
                        submitButtonText={t("submit")}
                        showSectionTitles={true}
                    />
                </CardElement>
            );
        }, [innerRef, t, formSections, initParameters, showWelcomeDialog]);

        /**
         * SSO sign up dialog body (no password, pre-filled from SSO session)
         */
        const ssoProviderIcons: Record<string, string> = {
            microsoft: "bi-microsoft",
            google: "bi-google",
        };

        const ssoSignUpDialogBody = useMemo(() => {
            if (!ssoRef?.commit || !ssoToken || !ssoSessionData) return null;

            const providerIcon = ssoProviderIcons[ssoSessionData.provider] || "bi-box-arrow-in-right";
            const providerName = ssoSessionData.provider.charAt(0).toUpperCase() + ssoSessionData.provider.slice(1);

            return (
                <CardElement
                    variant="flat"
                    padding="lg"
                >
                    <div className="d-flex align-items-center gap-2 p-2 mb-3 rounded bg-light border">
                        <i className={`bi ${providerIcon}`}></i>
                        <span className="small">
                            {t("ssoConnectedVia", {values: {provider: providerName}})}
                        </span>
                        <i className="bi bi-check-circle-fill text-success ms-auto"></i>
                    </div>
                    <FormFeature
                        uniqueKey="signup-sso-form"
                        sections={ssoFormSections}
                        submit={(parameters) => {
                            ssoRef.commit?.({
                                variables: {
                                    inputs: {
                                        ssoToken: ssoToken,
                                        clientName: parameters.clientName,
                                        languageCode: parameters.languageCode,
                                        firstName: parameters.firstName || null,
                                        lastName: parameters.lastName || null,
                                        genderCode: parameters.genderCode || null,
                                        acceptedTermsOfUse: !!parameters.acceptedTermsOfUse,
                                    }
                                },
                                onCompleted: () => {
                                    searchParams.delete("sso_token");
                                    setSearchParams(searchParams, {replace: true});
                                    showWelcomeDialog();
                                }
                            });
                        }}
                        isInFlight={ssoRef.isInFlight}
                        initParameters={ssoInitParameters}
                        submitButtonText={t("submit")}
                        showSectionTitles={true}
                    />
                </CardElement>
            );
        }, [ssoRef, ssoToken, ssoSessionData, t, ssoFormSections, ssoInitParameters, searchParams, setSearchParams, showWelcomeDialog]);

        /*******************************************************************************************************************
         *                                                  CALLBACKS
         ******************************************************************************************************************/

        /**
         * Open sign up dialog
         */
        const openSignUpDialog = useCallback(() => {
            if (!signUpDialogBody) return;

            dialog.open({
                uniqueKey: "sign-up",
                title: t("dialogTitle"),
                placement: "end",
                size: "lg",
                body: signUpDialogBody,
            });
        }, [dialog, t, signUpDialogBody]);

        /**
         * Open SSO sign up dialog (no password, pre-filled from SSO session)
         */
        const openSSOSignUpDialog = useCallback(() => {
            if (!ssoSignUpDialogBody) return;

            dialog.open({
                uniqueKey: "sign-up",
                title: t("dialogTitle"),
                placement: "end",
                size: "lg",
                body: ssoSignUpDialogBody,
            });
        }, [dialog, t, ssoSignUpDialogBody]);

        /*******************************************************************************************************************
         *                                                  EFFECTS
         ******************************************************************************************************************/

        // Register dialog configuration for deep linking
        useEffect(() => {
            if (!innerRef?.commit) return;

            const unregister = dialog.register("sign-up", {
                title: t("dialogTitle"),
                placement: "end" as const,
                size: "lg" as const,
                body: signUpDialogBody,
            });

            return unregister;
        }, [innerRef, dialog, t, signUpDialogBody]);

        // Load SSO session data when sso_token is present
        useEffect(() => {
            if (ssoToken && ssoQueryRef?.hasPermission && !ssoQueryRef?.isLoading && !ssoQueryRef.data) {
                ssoQueryRef?.load();
            }
        }, [ssoToken, ssoQueryRef?.hasPermission, ssoQueryRef?.load]);

        // Auto-open SSO signup dialog when session data is loaded
        useEffect(() => {
            if (ssoToken && ssoSessionData && ssoRef?.commit) {
                openSSOSignUpDialog();
            }
        }, [ssoToken, ssoSessionData, ssoRef?.commit]);

        // Update ref with permission status
        useEffect(() => {
            const data = {
                hasPermission: !!innerRef?.commit
            }
            if (typeof ref === 'function') {
                ref(data)
            } else if (ref) {
                ref.current = data
            }
        },[innerRef?.commit, ref])

        /*******************************************************************************************************************
         *                                                  RENDER
         ******************************************************************************************************************/

        return (
            <LysMutationProvider
                mutation={CreateClientMutation}
                ref={setInnerRef}
            >
                <LysMutationProvider
                    mutation={CreateClientWithSSOMutation}
                    ref={setSsoRef}
                >
                    {ssoToken && (
                        <LysQueryProvider
                            query={SSOSessionQuery}
                            parameters={{token: ssoToken}}
                            ref={setSsoQueryRef}
                            as="span"
                        />
                    )}
                    {innerRef?.commit && (
                        <ButtonElement
                            variant="link"
                            size="sm"
                            type="button"
                            onClick={openSignUpDialog}
                            className="p-0"
                        >
                            {t("linkText")}
                        </ButtonElement>
                    )}
                </LysMutationProvider>
            </LysMutationProvider>
        );
    }
);

SignUpRestricted.displayName = "SignUpRestricted";

export default SignUpRestricted;