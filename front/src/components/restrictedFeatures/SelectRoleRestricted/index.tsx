import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectRoleRestrictedProps} from "./types";
import {useSelectRoleRestrictedTranslations} from "./translations";
import {CommonTranslationKey} from "@/services/i18n/common";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectRoleRestrictedQuery} from "./__generated__/SelectRoleRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";

/**
 * GraphQL query for roles
 */
const RolesQuery = graphql`
    query SelectRoleRestrictedQuery {
        allRoles(enabled: true, orderBy: {code: true}) {
            edges {
                node {
                    code
                }
            }
        }
    }
`;

/**
 * SelectRoleRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected role selection
 * - GraphQL query via LysQueryProvider for roles
 * - Fetches only enabled roles ordered by code
 * - Wraps SelectElement with role options
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch roles
 * - Transforms GraphQL data to SelectOption format
 * - Uses translation system for label
 * - Handles permission checking for data access
 */
const SelectRoleRestricted: React.FC<SelectRoleRestrictedProps> = (props) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useSelectRoleRestrictedTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Transform GraphQL data to SelectOption format for roles
     */
    const roleOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectRoleRestrictedQuery["response"] | undefined;

        if (!data?.allRoles?.edges) {
            return [];
        }

        return data.allRoles.edges.map((edge) => ({
            label: common(edge.node.code as CommonTranslationKey),
            value: edge.node.code
        }));
    }, [queryRef?.data, common]);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Load query on mount when permission is granted and no data yet
     */
    useEffect(() => {
        if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) {
            queryRef?.load();
        }
    }, [queryRef?.hasPermission, queryRef?.load]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={RolesQuery}
            parameters={{}}
            options={{fetchPolicy: 'store-or-network'}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={roleOptions}
                label={t("label")}
            />
        </LysQueryProvider>
    );
};

SelectRoleRestricted.displayName = "SelectRoleRestricted";

export default SelectRoleRestricted;