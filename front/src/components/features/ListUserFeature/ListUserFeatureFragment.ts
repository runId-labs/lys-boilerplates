import {graphql} from "react-relay";

/**
 * Fragment for user list data
 * Used by both ListAdminRestricted and ListClientUserRestricted
 */
export const ListUserFeatureFragment = graphql`
    fragment ListUserFeatureFragment_user on UserNode @relay(plural: true) {
        id
        emailAddress {
            address
            validatedAt
        }
        status {
            code
        }
        privateData {
            firstName
            lastName
        }
        roles {
            id
            code
        }
        createdAt
    }
`;

/**
 * Fragment for client user list data
 * Now uses UserNode directly with clientId field
 */
export const ListUserFeatureFragment_clientUser = graphql`
    fragment ListUserFeatureFragment_clientUser on UserNode @relay(plural: true) {
        id
        client {
            id
            name
        }
        emailAddress {
            address
            validatedAt
        }
        status {
            code
        }
        privateData {
            firstName
            lastName
        }
        organizationRoles {
            id
            code
        }
        isLicensed
    }
`;