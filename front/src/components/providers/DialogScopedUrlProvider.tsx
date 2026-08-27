import React, {useEffect, useRef} from "react";
import {useUrlQueries} from "lys-front/providers";

/** URL param holding the LysDialog stack (comma-separated dialog keys). */
const DIALOG_STACK_PARAM = "dStack";

interface DialogScopedUrlProviderProps {
    children: React.ReactNode;
}

/**
 * DialogScopedUrlProvider
 *
 * Generic guarantee that dialog-scoped URL params are cleaned up. Watches the dialog stack
 * param (`dStack`) and, when a dialog key leaves the stack — i.e. it is truly closed, not
 * merely covered by another dialog — removes every URL param namespaced under it
 * (`{key}_*`), which is where useDialogScopedUrlState persists a dialog's state.
 *
 * Mount once around the dialog-bearing tree, under UrlQueriesProvider. Does nothing when
 * `dStack` is absent (LysDialog `syncWithUrl` off), so the scoped-URL mechanism is inert.
 */
const DialogScopedUrlProvider: React.FC<DialogScopedUrlProviderProps> = ({children}) => {
    const {appliedParams, update} = useUrlQueries();
    const prevKeysRef = useRef<string[]>([]);

    const stackParam = appliedParams.get(DIALOG_STACK_PARAM) ?? "";

    useEffect(() => {
        const currentKeys = stackParam ? stackParam.split(",").filter(Boolean) : [];
        const removedKeys = prevKeysRef.current.filter((key) => !currentKeys.includes(key));
        prevKeysRef.current = currentKeys;

        if (removedKeys.length === 0) return;

        // Null out every namespaced param of the dialog keys that just left the stack.
        const cleanup: Record<string, null> = {};
        for (const key of removedKeys) {
            const prefix = `${key}_`;
            for (const param of Array.from(appliedParams.keys())) {
                if (param.startsWith(prefix)) cleanup[param] = null;
            }
        }
        if (Object.keys(cleanup).length > 0) update(cleanup);
    }, [stackParam, appliedParams, update]);

    return <>{children}</>;
};

DialogScopedUrlProvider.displayName = "DialogScopedUrlProvider";

export default DialogScopedUrlProvider;
