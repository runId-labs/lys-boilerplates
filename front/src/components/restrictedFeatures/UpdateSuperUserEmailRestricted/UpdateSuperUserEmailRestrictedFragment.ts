import {graphql} from "react-relay";

/**
 * Fragment defining the user fields needed/modified by UpdateSuperUserEmailRestricted
 */
export const UpdateSuperUserEmailRestrictedFragment = graphql`
    fragment UpdateSuperUserEmailRestrictedFragment_user on UserNode {
        id
        emailAddress {
            id
            address
            validatedAt
            lastValidationRequestAt
        }
    }
`;