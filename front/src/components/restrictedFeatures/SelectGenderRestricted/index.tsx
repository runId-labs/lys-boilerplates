import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectGenderRestrictedProps} from "./types";
import {useSelectGenderRestrictedTranslations, SelectGenderTranslationKey} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectGenderRestrictedQuery} from "./__generated__/SelectGenderRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";

/**
 * GraphQL query for genders
 */
const GendersQuery = graphql`
    query SelectGenderRestrictedQuery {
        allGenders {
            edges {
                node {
                    code
                }
            }
        }
    }
`;

/**
 * SelectGenderRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected gender selection
 * - GraphQL query via LysQueryProvider for genders
 * - Automatic translation of labels
 * - Wraps SelectElement with gender options
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch genders
 * - Transforms GraphQL data to SelectOption format
 * - Uses translation system for label and helperText
 * - Handles permission checking for data access
 */
const SelectGenderRestricted: React.FC<SelectGenderRestrictedProps> = (props) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useSelectGenderRestrictedTranslations();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Transform GraphQL data to SelectOption format for genders
     */
    const genderOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectGenderRestrictedQuery["response"] | undefined;

        if (!data?.allGenders?.edges) {
            return [];
        }

        return data.allGenders.edges.map((edge) => ({
            label: t(edge.node.code.toUpperCase() as SelectGenderTranslationKey),
            value: edge.node.code
        }));
    }, [queryRef?.data, t]);

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
            query={GendersQuery}
            parameters={{}}
            options={{fetchPolicy: 'store-or-network'}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={genderOptions}
                label={t("label")}
            />
        </LysQueryProvider>
    );
};

SelectGenderRestricted.displayName = "SelectGenderRestricted";

export default SelectGenderRestricted;