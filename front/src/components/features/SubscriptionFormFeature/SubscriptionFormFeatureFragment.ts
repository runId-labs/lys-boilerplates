import {graphql} from "react-relay";

/**
 * Fragment defining the subscription fields needed by SubscriptionFormFeature
 */
export const SubscriptionFormFeatureFragment = graphql`
    fragment SubscriptionFormFeatureFragment_subscription on SubscriptionNode {
        isFree
        hasPendingDowngrade
        createdAt
        updatedAt
        planVersion {
            prices {
                id
                amount
                period {
                    code
                }
                currency {
                    code
                    minorUnit
                }
            }
            plan {
                code
            }
            rules {
                id
                limitValue
                isQuota
                isUnlimited
                rule {
                    code
                }
            }
        }
    }
`;