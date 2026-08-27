import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectClientRestrictedProps} from "./types";
import {useSelectClientRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectClientRestrictedQuery} from "./__generated__/SelectClientRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";
import {useFilterLabels} from "lys-front/providers";

/**
 * GraphQL query for clients
 */
const ClientsQuery = graphql`
    query SelectClientRestrictedQuery {
        allClients(orderBy: {name: true}) {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`;

/**
 * SelectClientRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected client selection
 * - GraphQL query via LysQueryProvider for clients
 * - Wraps SelectElement with client options
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch clients
 * - Transforms GraphQL data to SelectOption format
 * - Uses translation system for label
 * - Handles permission checking for data access
 */
const SelectClientRestricted: React.FC<SelectClientRestrictedProps> = (props) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useSelectClientRestrictedTranslations();
    const {setLabel} = useFilterLabels();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Transform GraphQL data to SelectOption format for clients
     */
    const clientOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectClientRestrictedQuery["response"] | undefined;

        if (!data?.allClients?.edges) {
            return [];
        }

        return data.allClients.edges.map((edge) => ({
            label: edge.node.name,
            value: edge.node.id
        }));
    }, [queryRef?.data]);

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

    /**
     * Register label when options are loaded and a value is already selected
     */
    useEffect(() => {
        if (props.value && clientOptions.length > 0) {
            const selectedOption = clientOptions.find(opt => opt.value === props.value);
            if (selectedOption) {
                setLabel(String(props.value), selectedOption.label);
            }
        }
    }, [props.value, clientOptions, setLabel]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle selection change - register label and call parent onChange
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedOption = clientOptions.find(opt => opt.value === selectedValue);

        if (selectedOption) {
            setLabel(selectedValue, selectedOption.label);
        }

        // Call parent onChange if provided
        props.onChange?.(e);
    }, [clientOptions, setLabel, props.onChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={ClientsQuery}
            parameters={{}}
            options={{fetchPolicy: 'store-and-network'}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={clientOptions}
                label={t("label")}
                onChange={handleChange}
            />
        </LysQueryProvider>
    );
};

SelectClientRestricted.displayName = "SelectClientRestricted";

export default SelectClientRestricted;