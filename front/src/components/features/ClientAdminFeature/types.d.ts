import type {ClientAdminRestrictedQuery} from "@/components/restrictedFeatures/ClientAdminRestricted/__generated__/ClientAdminRestrictedQuery.graphql";

/**
 * ClientAdminFeature props
 */
export interface ClientAdminFeatureProps {
    /**
     * Client data from GraphQL query
     */
    clientData: NonNullable<ClientAdminRestrictedQuery["response"]["client"]>;
}