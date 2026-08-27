import {useCallback, useTransition} from "react";
import {useNavigate} from "react-router-dom";
import {useRouteAccess, useRouteInfo} from "lys-front/providers";
import {generateUrlByRoute} from "lys-front/tools";

/**
 * Composes route lookup, permission check and navigation into a single helper.
 *
 * `buildNavigateOnClick(name, queryParameters?)` returns:
 * - A click handler that navigates to the route via `startTransition`, when the
 *   route exists and the user has access to its `mainWebserviceName` (or when
 *   the route has no `mainWebserviceName` defined).
 * - `undefined` when the route is unknown or the user lacks the permission.
 *
 * Pairing the `undefined` return with components that filter out items whose
 * `onClick` is undefined (e.g. `DropDownMenuElement`) gives natural permission-
 * driven visibility without leaking the route/webservice lookup at every call
 * site.
 */
export const useRouteNavigator = () => {
    const navigate = useNavigate();
    const [, startTransition] = useTransition();
    const {getRouteByName} = useRouteInfo();
    const hasAccess = useRouteAccess();

    const buildNavigateOnClick = useCallback(
        (
            name: string,
            queryParameters?: Record<string, string>
        ): (() => void) | undefined => {
            const route = getRouteByName(name);
            if (!route || !hasAccess(route)) return undefined;
            return () => {
                startTransition(() => {
                    navigate(generateUrlByRoute(route, {}, queryParameters));
                });
            };
        },
        [getRouteByName, hasAccess, navigate, startTransition]
    );

    return {buildNavigateOnClick};
};