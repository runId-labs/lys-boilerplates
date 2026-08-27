import {useCallback, useMemo} from "react";
import {useIntl} from "react-intl";
import {useLysDialog} from "lys-front/providers";
import {useWebserviceAccess} from "lys-front/providers";
import CreatePlanVersionRestricted, {CreatePlanVersionMutation} from "./index";
import {PrimaryAction} from "@/components/features/ShowActionsFeature/types";

/**
 * Hook options
 */
interface UseCreatePlanVersionRestrictedActionOptions {
    /**
     * Callback called after successful creation
     * Useful for refreshing the list
     */
    onCompleted?: () => void;

    /**
     * Initial form values to pre-fill the dialog (e.g. the plan currently used
     * as a list filter)
     */
    initParameters?: Record<string, any>;
}

/**
 * Hook for publishing a plan version
 *
 * This hook:
 * - Checks permission via checkOperationsPermission with the actual mutation
 * - Opens dialog with CreatePlanVersionRestricted
 * - Returns action config for ShowActionsFeature or null if no permission
 *
 * Usage:
 * ```tsx
 * const createPlanVersionAction = useCreatePlanVersionRestrictedAction({
 *     onCompleted: () => queryRef?.load()
 * });
 *
 * <ShowActionsFeature primaryAction={createPlanVersionAction} />
 * ```
 */
export function useCreatePlanVersionRestrictedAction(
    options?: UseCreatePlanVersionRestrictedActionOptions
): PrimaryAction | null {
    const intl = useIntl();
    const {open, close} = useLysDialog();
    const {checkOperationsPermission} = useWebserviceAccess();

    /**
     * Check if user has permission to publish plan versions
     */
    const hasPermission = useMemo(() => {
        return checkOperationsPermission(CreatePlanVersionMutation);
    }, [checkOperationsPermission]);

    /**
     * Open creation dialog
     */
    const handleOpen = useCallback(() => {
        open({
            uniqueKey: "create-plan-version",
            title: intl.formatMessage({
                id: "lys.components.restrictedFeatures.createPlanVersionRestricted.dialogTitle",
                defaultMessage: "Publish a plan version"
            }),
            body: CreatePlanVersionRestricted,
            bodyProps: {
                initParameters: options?.initParameters,
                onCompleted: () => {
                    // Close dialog first
                    close();
                    // Then call external callback
                    options?.onCompleted?.();
                }
            },
            placement: "end",
            size: "lg"
        });
    }, [open, close, intl, options?.onCompleted, options?.initParameters]);

    /**
     * Return null if no permission
     */
    if (!hasPermission) {
        return null;
    }

    /**
     * Return action config for ShowActionsFeature
     */
    return {
        label: intl.formatMessage({
            id: "lys.components.restrictedFeatures.createPlanVersionRestricted.buttonLabel",
            defaultMessage: "Publish a version"
        }),
        icon: "bi-plus-lg",
        onClick: handleOpen,
        variant: "primary"
    };
}
