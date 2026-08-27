import {ReactNode} from "react";

/**
 * UpdateSuperUserPrivateDataRestricted props
 */
export interface UpdateSuperUserPrivateDataRestrictedProps {
    /**
     * Super user ID to update
     */
    userId: string;

    /**
     * Current first name
     */
    firstName?: string;

    /**
     * Current last name
     */
    lastName?: string;

    /**
     * Current gender code
     */
    genderCode?: string;

    /**
     * Current language code
     */
    languageCode?: string;

    /**
     * Optional footer content
     */
    footer?: ReactNode;

    /**
     * Callback when update is completed
     */
    onCompleted?: (data: any) => void;
}

/**
 * UpdateSuperUserPrivateDataRestricted ref interface
 */
export interface UpdateSuperUserPrivateDataRestrictedRefInterface {
    /**
     * Whether the user has permission to update super user private data
     */
    hasPermission: boolean;
}