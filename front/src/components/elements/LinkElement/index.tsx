import React, {useCallback, useTransition} from "react";
import {useNavigate} from "react-router-dom";
import {cn} from "lys-front/tools";
import {LinkElementProps} from "./types";

/**
 * LinkElement component
 *
 * Element component (Layer 1) that provides:
 * - Pure UI link rendering
 * - Navigation wrapped in startTransition to prevent Suspense errors
 * - No permission logic (handled by LinkRestricted)
 *
 * This is a pure presentation component (Layer 1) that:
 * - Renders links without business logic
 * - Can be used independently when no permissions needed
 * - Consumed by LinkRestricted for permission-protected links
 */
const LinkElement: React.FC<LinkElementProps> = ({
    to,
    className,
    onClick,
    children
}) => {
    const navigate = useNavigate();
    const [, startTransition] = useTransition();

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick?.(e);
        startTransition(() => { navigate(to); });
    }, [onClick, startTransition, navigate, to]);

    return (
        <a
            className={cn(className)}
            href={to}
            onClick={handleClick}
        >
            {children}
        </a>
    );
};

LinkElement.displayName = "LinkElement";

export default LinkElement;