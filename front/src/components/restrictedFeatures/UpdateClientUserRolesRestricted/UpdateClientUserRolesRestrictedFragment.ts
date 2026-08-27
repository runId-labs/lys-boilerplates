import {graphql} from "react-relay";

/**
 * Fragment for UpdateClientUserRolesRestricted
 * Fetches user organization roles data
 */
export const UpdateClientUserRolesRestrictedFragment = graphql`
    fragment UpdateClientUserRolesRestrictedFragment_clientUser on UserNode {
        id
        organizationRoles {
            code
        }
    }
`;
