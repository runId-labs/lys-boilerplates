import {forwardRef, useEffect, useRef} from "react";
import {FormattedMessage} from "react-intl";
import {LinkRestrictedProps, LinkRestrictedRefInterface} from "./types";
import {generateUrlByRoute} from "lys-front/tools";
import {useRestrictedLink} from "lys-front/providers";
import LinkElement from "@/components/elements/LinkElement";

/**
 * LinkRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission checking based on route.mainWebserviceName
 * - Automatic URL generation from route and parameters
 * - Fallback to i18n message if no children provided
 * - Exposes hasPermission and access() method via ref
 * - Hides link if user lacks permission
 *
 * This is a restricted feature component (Layer 3) that:
 * - Wraps LinkElement with permission logic
 * - Uses useRestrictedLink hook from lys-front for permission + navigation
 * - Provides programmatic navigation via ref
 */
const LinkRestricted = forwardRef<LinkRestrictedRefInterface, LinkRestrictedProps>((
    {
        route,
        className,
        parameters = {},
        queryParameters = {},
        onClick,
        children
    },
    ref
) => {
    const {hasPermission, navigate} = useRestrictedLink(route, parameters, queryParameters);

    /**
     * Track previous permission to avoid unnecessary ref updates
     */
    const prevHasPermissionRef = useRef<boolean | null>(null);

    /**
     * Update ref with permission status and access method
     * Only update when hasPermission actually changes to avoid infinite loops
     */
    useEffect(() => {
        // Skip if permission hasn't changed
        if (prevHasPermissionRef.current === hasPermission) {
            return;
        }
        prevHasPermissionRef.current = hasPermission;

        const newRef: LinkRestrictedRefInterface = {
            hasPermission,
            methods: {}
        };

        if (hasPermission && navigate) {
            newRef.methods = {
                access: navigate
            };
        }

        if (typeof ref === 'function') {
            ref(newRef);
        } else if (ref) {
            ref.current = newRef;
        }
    }, [hasPermission, ref, navigate]);

    // Don't render if no permission
    if (!hasPermission) {
        return null;
    }

    return (
        <LinkElement
            to={generateUrlByRoute(route, parameters, queryParameters)}
            className={className}
            onClick={onClick}
        >
            {children || (
                <FormattedMessage
                    id={route.transPrefix + "name"}
                />
            )}
        </LinkElement>
    );
});

LinkRestricted.displayName = "LinkRestricted";

export default LinkRestricted;