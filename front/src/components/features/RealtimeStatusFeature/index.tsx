import React, {useEffect, useState} from "react";
import {useSignal} from "lys-front/providers";
import RealtimeStatusElement from "@/components/elements/RealtimeStatusElement";
import {OFFLINE_DISPLAY_DELAY_MS} from "./consts";

/**
 * RealtimeStatusFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Visibility on a lasting loss of the real-time connection
 * - A grace period so short drops, which the provider reconnects on its own,
 *   never surface
 *
 * Renders nothing while the connection is up.
 */
const RealtimeStatusFeature: React.FC = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {isConnected} = useSignal();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [isOfflineVisible, setIsOfflineVisible] = useState(false);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Show the indicator only once the outage has lasted long enough to matter
     */
    useEffect(() => {
        if (isConnected) {
            setIsOfflineVisible(false);
            return;
        }

        const timer = setTimeout(() => setIsOfflineVisible(true), OFFLINE_DISPLAY_DELAY_MS);

        return () => clearTimeout(timer);
    }, [isConnected]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (!isOfflineVisible) {
        return null;
    }

    return <RealtimeStatusElement/>;
};

RealtimeStatusFeature.displayName = "RealtimeStatusFeature";

export default RealtimeStatusFeature;
