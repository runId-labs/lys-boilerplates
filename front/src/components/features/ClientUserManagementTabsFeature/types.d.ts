import {GraphQLTaggedNode} from "react-relay";

/**
 * Props for ClientUserManagementTabsFeature component
 */
export interface ClientUserManagementTabsFeatureProps {
    /**
     * Fragment reference for the client user data
     */
    clientUserFragmentRef?: any;

    /**
     * Callback when any mutation completes successfully
     */
    onCompleted?: (data: any) => void;
}
