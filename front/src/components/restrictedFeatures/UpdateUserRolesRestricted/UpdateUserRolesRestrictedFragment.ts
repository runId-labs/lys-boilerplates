import {graphql} from "react-relay";

/**
 * Fragment for UpdateUserRolesRestricted
 * Fetches user roles data
 */
export const UpdateUserRolesRestrictedFragment = graphql`
    fragment UpdateUserRolesRestrictedFragment_user on UserNode {
        id
        roles {
            code
        }
    }
`;