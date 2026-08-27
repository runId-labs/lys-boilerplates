import React, {useCallback, useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectLicensePlanRestrictedProps} from "./types";
import {useSelectLicensePlanRestrictedTranslations} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {SelectLicensePlanRestrictedQuery} from "./__generated__/SelectLicensePlanRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";
import {useFilterLabels} from "lys-front/providers";
import {CommonTranslationKey} from "@/services/i18n/common";

/**
 * GraphQL query for license plans
 *
 * Retired plans are listed too: versions sold under them still exist, and
 * filtering on those versions has to stay possible.
 */
const LicensePlansQuery = graphql`
    query SelectLicensePlanRestrictedQuery {
        allLicensePlans {
            edges {
                node {
                    id
                    code
                }
            }
        }
    }
`;

/**
 * SelectLicensePlanRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected license plan selection
 * - GraphQL query via LysQueryProvider for plans
 * - Wraps SelectElement with plan options
 */
const SelectLicensePlanRestricted: React.FC<SelectLicensePlanRestrictedProps> = (props) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t, common} = useSelectLicensePlanRestrictedTranslations();
    const {setLabel} = useFilterLabels();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Transform GraphQL data to SelectOption format
     *
     * The plan code is the value: it is the plan identifier the listing
     * webservices filter on, not the relay global ID.
     */
    const planOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectLicensePlanRestrictedQuery["response"] | undefined;

        if (!data?.allLicensePlans?.edges) {
            return [];
        }

        return data.allLicensePlans.edges.map((edge) => ({
            label: common(edge.node.code as CommonTranslationKey) || edge.node.code,
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

    /**
     * Register label when options are loaded and a value is already selected
     */
    useEffect(() => {
        if (props.value && planOptions.length > 0) {
            const selectedOption = planOptions.find(opt => opt.value === props.value);
            if (selectedOption) {
                setLabel(String(props.value), selectedOption.label);
            }
        }
    }, [props.value, planOptions, setLabel]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle selection change - register label and call parent onChange
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedOption = planOptions.find(opt => opt.value === selectedValue);

        if (selectedOption) {
            setLabel(selectedValue, selectedOption.label);
        }

        // Call parent onChange if provided
        props.onChange?.(e);
    }, [planOptions, setLabel, props.onChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <LysQueryProvider
            query={LicensePlansQuery}
            parameters={{}}
            options={{fetchPolicy: 'store-or-network'}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={planOptions}
                label={t("label")}
                onChange={handleChange}
            />
        </LysQueryProvider>
    );
};

SelectLicensePlanRestricted.displayName = "SelectLicensePlanRestricted";

export default SelectLicensePlanRestricted;
