import {graphql} from "react-relay";

/**
 * Fragment for super user private data used by UpdateSuperUserPrivateDataRestricted
 */
export const UpdateSuperUserPrivateDataRestrictedFragment = graphql`
    fragment UpdateSuperUserPrivateDataRestrictedFragment_user on UserNode {
        id
        privateData {
            firstName
            lastName
            gender {
                code
            }
        }
        language {
            code
        }
    }
`;