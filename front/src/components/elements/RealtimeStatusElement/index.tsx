import React from "react";
import {RealtimeStatusElementProps} from "./types";
import {useRealtimeStatusElementTranslations} from "./translations";
import {cn} from "lys-front/tools";
import "./styles.scss";

/**
 * RealtimeStatusElement component
 *
 * Element component (Layer 1) — states that live updates are currently interrupted.
 *
 * Rendering is the caller's decision: this element only draws the indicator.
 */
const RealtimeStatusElement: React.FC<RealtimeStatusElementProps> = ({
    label,
    title,
    className
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useRealtimeStatusElementTranslations();

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <span
            className={cn("realtime-status-element", className)}
            title={title ?? t("offlineDetail")}
            role="status"
        >
            <i className="bi bi-wifi-off" aria-hidden="true"/>
            {label ?? t("offline")}
        </span>
    );
};

RealtimeStatusElement.displayName = "RealtimeStatusElement";

export default RealtimeStatusElement;
