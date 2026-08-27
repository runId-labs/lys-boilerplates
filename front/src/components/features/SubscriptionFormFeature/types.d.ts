import {SubscriptionFormFeatureFragment_subscription$key} from "./__generated__/SubscriptionFormFeatureFragment_subscription.graphql";

/**
 * SubscriptionFormFeature props
 */
export interface SubscriptionFormFeatureProps {
    /**
     * Fragment reference for subscription data
     */
    subscriptionRef: SubscriptionFormFeatureFragment_subscription$key;

    /**
     * Whether the form is disabled (read-only mode)
     */
    disabled?: boolean;
}

/**
 * SubscriptionFormFeature ref interface
 */
export interface SubscriptionFormFeatureRef {
    /**
     * Reset form to initial values
     */
    reset: () => void;
}