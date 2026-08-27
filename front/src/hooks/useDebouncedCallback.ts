import {useCallback, useEffect, useRef} from "react";

/**
 * useDebouncedCallback
 *
 * Returns a debounced version of `callback`: calls within `delayMs` of each other
 * collapse into a single invocation, fired `delayMs` after the last call.
 *
 * Used to coalesce bursts of backend push signals (e.g. one per file of a batch
 * import, each firing independently) into a single UI refresh instead of one per
 * signal — see useDiagnosticRunGate for the non-bursty case that doesn't need this.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    delayMs: number
): (...args: TArgs) => void {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    return useCallback((...args: TArgs) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayMs]);
}
