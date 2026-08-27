import {useDialogWithUpdates} from "lys-front/providers";
import {useImportBellRestrictedTranslations} from "./translations";
import ImportListRestricted from "@/components/restrictedFeatures/ImportListRestricted";

const DIALOG_KEY = "import-panel";

/**
 * Hook to open the import panel dialog (right side panel)
 */
export const useImportPanelDialog = () => {
    const {t} = useImportBellRestrictedTranslations();

    const dialog = useDialogWithUpdates({
        uniqueKey: DIALOG_KEY,
        title: t("imports"),
        size: "md",
        placement: "end",
        body: ImportListRestricted,
        bodyProps: {},
        deps: []
    });

    return {
        open: dialog.open,
        close: dialog.close,
        isOpen: dialog.isOpen,
    };
};
