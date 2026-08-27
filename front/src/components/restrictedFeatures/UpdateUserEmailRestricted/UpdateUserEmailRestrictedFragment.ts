import {graphql} from "react-relay";

/**
 * Fragment defining the user fields needed/modified by UpdateUserEmailRestricted
 *
 * This fragment is used by:
 * - UpdateUserEmailRestrictedMutation (returns updated data)
 * - Parent queries that need to fetch user data for this component
 */
export const UpdateUserEmailRestrictedFragment = graphql`
    fragment UpdateUserEmailRestrictedFragment_user on UserNode {
        id
        emailAddress {
            id
            address
            validatedAt
            lastValidationRequestAt
        }
    }
`;