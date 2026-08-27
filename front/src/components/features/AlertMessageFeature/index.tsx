import React, {useCallback} from "react";
import {useIntl} from "react-intl";
import {AlertMessageFeatureProps} from "./types";
import ToastElement from "@/components/elements/ToastElement";
import ToastContainerElement from "@/components/elements/ToastContainerElement";
import {AlertLevelType} from "lys-front/providers";
import {ToastVariant} from "@/components/elements/ToastElement/types";
import {useAlertMessageTranslations} from "./translations";
import {isErrorKey} from "@/services/i18n/errors";

/**
 * AlertMessageFeature component
 *
 * Displays alert messages as toast notifications:
 * - Maps alert levels to toast variants
 * - Handles message removal
 * - Configurable position and auto-hide behavior
 * - Stacks multiple toasts vertically
 * - Internationalized titles and timestamps
 * - Translates error constants from backend
 *
 * This is a feature component (Layer 2) used by AlertMessageProvider
 * to render alert messages.
 */
const AlertMessageFeature: React.FC<AlertMessageFeatureProps> = ({
    messages,
    onRemove,
    position = "bottom-end",
    delay = 5000,
    autohide = true,
    ignoredErrorCodes = [],
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useAlertMessageTranslations();
    const intl = useIntl();

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Map alert levels to toast variants
     */
    const levelToVariant = useCallback((level: AlertLevelType): ToastVariant => {
        switch (level) {
            case "CRITICAL":
            case "ERROR":
                return "danger";
            case "WARNING":
                return "warning";
            case "SUCCESS":
                return "success";
            case "INFO":
            default:
                return "info";
        }
    }, []);

    /**
     * Map alert levels to translated titles
     */
    const levelToTitle = useCallback((level: AlertLevelType): string => {
        switch (level) {
            case "CRITICAL":
                return t("levelCritical");
            case "ERROR":
                return t("levelError");
            case "WARNING":
                return t("levelWarning");
            case "SUCCESS":
                return t("levelSuccess");
            case "INFO":
            default:
                return t("levelInfo");
        }
    }, [t]);

    /**
     * Translate error message if it's a known error key
     * Otherwise return the original text
     */
    const translateErrorMessage = useCallback((text: string, level: AlertLevelType): string => {
        // Check if the text is a known error key
        if (isErrorKey(text)) {
            // Note: "translation" keyword is skipped by generateI18nMessage
            return intl.formatMessage({id: `lys.services.i18n.errors.${text}`});
        }
        // Critical messages are raw backend error codes — hide unknown ones behind a generic fallback
        if (level === "CRITICAL") {
            console.error("Unhandled server error:", text);
            return intl.formatMessage({id: "lys.services.i18n.errors.UNKNOWN_ERROR"});
        }
        return text;
    }, [intl]);

    /**
     * Format timestamp for footer with translations
     */
    const formatTimestamp = useCallback((createdAt: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffSec = Math.floor(diffMs / 1000);

        if (diffSec < 5) {
            return t("justNow");
        } else if (diffSec < 60) {
            return diffSec === 1
                ? t("secondsAgo").replace("{count}", "1")
                : t("secondsAgoPlural").replace("{count}", diffSec.toString());
        } else if (diffSec < 3600) {
            const minutes = Math.floor(diffSec / 60);
            return minutes === 1
                ? t("minuteAgo").replace("{count}", "1")
                : t("minutesAgo").replace("{count}", minutes.toString());
        } else {
            const hours = Math.floor(diffSec / 3600);
            return hours === 1
                ? t("hourAgo").replace("{count}", "1")
                : t("hoursAgo").replace("{count}", hours.toString());
        }
    }, [t]);

    // Filter out ignored error codes
    const filteredMessages = messages.filter(
        (message) => !ignoredErrorCodes.includes(message.text)
    );

    if (filteredMessages.length === 0) {
        return null;
    }

    return (
        <ToastContainerElement position={position}>
            {filteredMessages.map((message) => (
                <ToastElement
                    key={message.id}
                    variant={levelToVariant(message.level)}
                    title={levelToTitle(message.level)}
                    body={translateErrorMessage(message.text, message.level)}
                    footer={formatTimestamp(message.createdAt)}
                    show={true}
                    onClose={() => onRemove(messages.indexOf(message))}
                    autohide={autohide}
                    delay={delay}
                    badgeCount={message.count}
                />
            ))}
        </ToastContainerElement>
    );
};

AlertMessageFeature.displayName = "AlertMessageFeature";

export default AlertMessageFeature;