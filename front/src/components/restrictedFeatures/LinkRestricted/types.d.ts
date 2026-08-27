import {MouseEventHandler, ReactNode} from "react";
import {RouteInterface} from "lys-front/types";

/**
 * LinkRestricted props
 */
interface LinkRestrictedProps {
    route: RouteInterface;
    className?: string;
    parameters?: {[key: string]: string};
    queryParameters?: {[key: string]: string};
    onClick?: MouseEventHandler;
    children?: ReactNode;
}

/**
 * LinkRestricted ref interface
 */
interface LinkRestrictedRefInterface {
    hasPermission: boolean;
    methods: {
        access?: () => void;
    };
}

export {
    LinkRestrictedProps,
    LinkRestrictedRefInterface
};