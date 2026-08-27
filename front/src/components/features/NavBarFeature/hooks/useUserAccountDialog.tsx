import {useDialogWithUpdates} from "lys-front/providers";
import {useConnectedUserInfo} from "lys-front/providers";
import {useNavBarFeatureTranslations} from "../translations";
import ConnectedUserManagementTabsFeature from "@/components/features/ConnectedUserManagementTabsFeature";

/**
 * Dialog unique key for user account management
 */
const DIALOG_KEY = "connected-user-management";

/**
 * useUserAccountDialog hook
 *
 * Manages the user account settings dialog
 * - Opens dialog with user account management tabs
 * - Only accessible when user is authenticated
 * - Integrates with LysDialogProvider for dialog management
 * - Uses Relay fragments for data fetching
 *
 * Usage:
 * ```tsx
 * const { open } = useUserAccountDialog()
 * <button onClick={open}>My Account</button>
 * ```
 */
export const useUserAccountDialog = () => {
    const {user} = useConnectedUserInfo();
    const {t} = useNavBarFeatureTranslations();

    /**
     * Dialog with automatic updates when user data changes
     */
    const dialog = useDialogWithUpdates({
        uniqueKey: DIALOG_KEY,
        title: t("accountSettings"),
        size: "lg",
        placement: "end",
        body: ConnectedUserManagementTabsFeature,
        bodyProps: {
            userData: user
        },
        deps: [user]
    });

    return {
        open: dialog.open,
        canOpen: !!user?.id
    };
};