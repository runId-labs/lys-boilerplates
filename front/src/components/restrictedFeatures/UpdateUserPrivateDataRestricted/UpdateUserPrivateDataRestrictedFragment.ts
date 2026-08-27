import {graphql} from "react-relay";

/**
 * Fragment defining the user fields needed/modified by UpdateUserPrivateDataRestricted
 *
 * This fragment is used by:
 * - UpdateUserPrivateDataRestrictedMutation (returns updated data)
 * - Parent queries that need to fetch user data for this component
 */
export const UpdateUserPrivateDataRestrictedFragment = graphql`
    fragment UpdateUserPrivateDataRestrictedFragment_user on UserNode {
        id
        privateData {
            id
            firstName
            lastName
            gender {
                id
                code
            }
        }
        language {
            id
            code
        }
    }
`;