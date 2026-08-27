import {ReactNode} from "react";

/**
 * Props for UpdateClientUserPrivateDataRestricted component
 */
export interface UpdateClientUserPrivateDataRestrictedProps {
    /**
     * Client user ID
     */
    clientUserId: string;

    /**
     * User's first name
     */
    firstName?: string;

    /**
     * User's last name
     */
    lastName?: string;

    /**
     * Gender code
     */
    genderCode?: string;

    /**
     * Language code
     */
    languageCode?: string;

    /**
     * Optional footer content for the card
     */
    footer?: ReactNode;

    /**
     * Callback when mutation completes successfully
     */
    onCompleted?: (data: any) => void;
}

/**
 * Ref interface for UpdateClientUserPrivateDataRestricted
 */
export interface UpdateClientUserPrivateDataRestrictedRefInterface {
    hasPermission: boolean;
}
