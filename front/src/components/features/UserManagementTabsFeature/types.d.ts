/**
 * UserManagementTabsFeature props
 */
export interface UserManagementTabsFeatureProps {
    /**
     * User fragment reference from GraphQL query
     * Component will unmask this using useFragment
     */
    userFragmentRef: any;

    /**
     * Optional callback called after successful mutation
     */
    onCompleted?: (response: any) => void;
}