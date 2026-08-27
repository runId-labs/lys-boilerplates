import {graphql} from "react-relay";

/**
 * Fragment for UpdateClientUserPrivateDataRestricted
 * Fetches user data including private data
 */
export const UpdateClientUserPrivateDataRestrictedFragment = graphql`
    fragment UpdateClientUserPrivateDataRestrictedFragment_clientUser on UserNode {
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