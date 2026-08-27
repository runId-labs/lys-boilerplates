/**
 * ConnectedUserManagementTabsFeature props
 */
export interface ConnectedUserManagementTabsFeatureProps {
    /**
     * User data fragment reference from parent query
     * Used with useFragment to read user data
     */
    userData: any;

    /**
     * Optional callback called when a mutation completes successfully
     * Used to propagate updates to parent components
     */
    onCompleted?: (response: any) => void;
}