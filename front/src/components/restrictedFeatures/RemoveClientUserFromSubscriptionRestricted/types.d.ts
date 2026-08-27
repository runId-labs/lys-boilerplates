export interface RemoveClientUserFromSubscriptionRestrictedProps {
    clientUserId: string;
    display?: boolean;
    onCompleted?: () => void;
}

export interface RemoveClientUserFromSubscriptionRestrictedRefInterface {
    hasPermission: boolean;
    open: () => void;
}