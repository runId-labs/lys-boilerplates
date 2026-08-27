import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SetPlanVersionEnabledRestrictedProps, SetPlanVersionEnabledRestrictedRefInterface} from "./types";
import {useSetPlanVersionEnabledRestrictedTranslations} from "./translations";
import {useLysDialog} from "lys-front/providers";
import {useAlertMessages} from "lys-front/providers";
import {LysMutationProvider} from "lys-front/providers";
import {LysMutationRefInterface} from "lys-front/providers";
import CardElement from "@/components/elements/CardElement";
import ButtonElement from "@/components/elements/ButtonElement";

/**
 * GraphQL mutation for changing the availability of a plan version
 */
const SetPlanVersionEnabledMutation = graphql`
    mutation SetPlanVersionEnabledRestrictedMutation($id: ID!, $enabled: Boolean!) {
        setLicensePlanVersionEnabled(id: $id, enabled: $enabled) {
            id
            enabled
        }
    }
`;

/**
 * Dialog content component for confirming the availability change
 */
interface SetEnabledDialogContentProps {
    planVersionId: string;
    enabled: boolean;
    onUpdated?: () => void;
}

const SetEnabledDialogContent: React.FC<SetEnabledDialogContentProps> = ({
    planVersionId,
    enabled,
    onUpdated
}) => {
    const {t} = useSetPlanVersionEnabledRestrictedTranslations();
    const alertMessage = useAlertMessages();
    const dialog = useLysDialog();

    const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

    /**
     * Target availability: the dialog toggles the current one
     */
    const nextEnabled = !enabled;

    /**
     * Handle confirmation
     */
    const handleConfirm = useCallback(() => {
        if (!mutationRef?.commit) return;

        mutationRef.commit({
            variables: {
                id: planVersionId,
                enabled: nextEnabled
            },
            onCompleted: () => {
                alertMessage.merge([{
                    text: t("success"),
                    level: "SUCCESS"
                }]);
                dialog.close();
                onUpdated?.();
            },
            onError: (error) => {
                alertMessage.merge([{
                    text: error.message || t("error"),
                    level: "ERROR"
                }]);
            }
        });
    }, [mutationRef, planVersionId, nextEnabled, alertMessage, t, dialog, onUpdated]);

    return (
        <LysMutationProvider
            mutation={SetPlanVersionEnabledMutation}
            notPermissionDisplayType="show"
            ref={setMutationRef}
        >
            <CardElement
                variant="flat"
                padding="lg"
            >
                <p className="mb-3">{nextEnabled ? t("enableMessage") : t("disableMessage")}</p>

                <div className="d-grid">
                    <ButtonElement
                        variant={nextEnabled ? "primary" : "danger"}
                        onClick={handleConfirm}
                        disabled={!mutationRef?.commit || mutationRef?.isInFlight}
                    >
                        {nextEnabled ? t("enableSubmit") : t("disableSubmit")}
                    </ButtonElement>
                </div>
            </CardElement>
        </LysMutationProvider>
    );
};

/**
 * SetPlanVersionEnabledRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected availability change of a plan version
 * - Confirmation dialog stating what the change does to subscribers
 * - setLicensePlanVersionEnabled mutation
 *
 * Only one version of a plan is on sale at a time: enabling one switches the
 * previous one off, which the dialog says before committing.
 */
const SetPlanVersionEnabledRestricted = forwardRef<SetPlanVersionEnabledRestrictedRefInterface, SetPlanVersionEnabledRestrictedProps>(
    ({planVersionId, enabled, display = true, onUpdated}, ref) => {
        const {t} = useSetPlanVersionEnabledRestrictedTranslations();
        const {open} = useLysDialog();

        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

        /**
         * Dialog unique key
         */
        const dialogKey = useMemo(() => `set-plan-version-enabled-${planVersionId}`, [planVersionId]);

        /**
         * Handle opening the dialog
         */
        const handleOpen = useCallback(() => {
            open({
                uniqueKey: dialogKey,
                title: enabled ? t("disableTitle") : t("enableTitle"),
                body: SetEnabledDialogContent,
                bodyProps: {
                    planVersionId,
                    enabled,
                    onUpdated
                },
                size: "md",
                syncWithUrl: false
            });
        }, [dialogKey, t, open, planVersionId, enabled, onUpdated]);

        /**
         * Expose hasPermission and open via ref
         */
        useImperativeHandle(ref, () => ({
            hasPermission: !!mutationRef?.commit,
            open: handleOpen
        }), [mutationRef?.commit, handleOpen]);

        return (
            <LysMutationProvider
                mutation={SetPlanVersionEnabledMutation}
                notPermissionDisplayType="hide"
                ref={setMutationRef}
            >
                {display && mutationRef?.commit && (
                    <ButtonElement
                        variant={enabled ? "danger" : "primary"}
                        size="sm"
                        onClick={handleOpen}
                    >
                        {enabled ? t("disableSubmit") : t("enableSubmit")}
                    </ButtonElement>
                )}
            </LysMutationProvider>
        );
    }
);

SetPlanVersionEnabledRestricted.displayName = "SetPlanVersionEnabledRestricted";

export default SetPlanVersionEnabledRestricted;
