import {useCallback, useMemo} from "react";
import {useIntl} from "react-intl";
import {useLysDialog} from "lys-front/providers";
import {useWebserviceAccess} from "lys-front/providers";
import CreateSuperUserRestricted, {CreateSuperUserMutation} from "./index";
import {PrimaryAction} from "@/components/features/ShowActionsFeature/types";

/**
 * Hook options
 */
interface UseCreateSuperUserRestrictedActionOptions {
    /**
     * Callback called after successful creation
     * Useful for refreshing the list
     */
    onCompleted?: () => void;
}

/**
 * Hook for creating super user action
 *
 * This hook:
 * - Checks permission via checkOperationsPermission with the actual mutation
 * - Opens dialog with CreateSuperUserRestricted
 * - Returns action config for ShowActionsFeature or null if no permission
 *
 * Usage:
 * ```tsx
 * const createAction = useCreateSuperUserRestrictedAction({
 *     onCompleted: () => queryRef?.load()
 * });
 *
 * <ShowActionsFeature primaryAction={createAction} />
 * ```
 */
export function useCreateSuperUserRestrictedAction(
    options?: UseCreateSuperUserRestrictedActionOptions
): PrimaryAction | null {
    const intl = useIntl();
    const {open, close} = useLysDialog();
    const {checkOperationsPermission} = useWebserviceAccess();

    /**
     * Check if user has permission to create super users
     */
    const hasPermission = useMemo(() => {
        return checkOperationsPermission(CreateSuperUserMutation);
    }, [checkOperationsPermission]);

    /**
     * Open creation dialog
     */
    const handleOpen = useCallback(() => {
        open({
            uniqueKey: "create-super-user",
            title: intl.formatMessage({
                id: "lys.components.restrictedFeatures.createSuperUserRestricted.title",
                defaultMessage: "Create Super User"
            }),
            body: CreateSuperUserRestricted,
            bodyProps: {
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
    }, [open, close, intl, options?.onCompleted]);

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
            id: "lys.components.restrictedFeatures.createSuperUserRestricted.title",
            defaultMessage: "Create Super User"
        }),
        icon: "bi-plus-lg",
        onClick: handleOpen,
        variant: "primary"
    };
}