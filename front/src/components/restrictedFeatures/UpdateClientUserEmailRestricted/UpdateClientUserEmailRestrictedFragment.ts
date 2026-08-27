import {graphql} from "react-relay";

/**
 * Fragment for UpdateClientUserEmailRestricted
 * Fetches user email address data
 */
export const UpdateClientUserEmailRestrictedFragment = graphql`
    fragment UpdateClientUserEmailRestrictedFragment_clientUser on UserNode {
        id
        emailAddress {
            address
            validatedAt
            lastValidationRequestAt
        }
    }
`;
