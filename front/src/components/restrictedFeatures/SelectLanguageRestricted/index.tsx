import React, {useEffect, useMemo, useState} from "react";
import {graphql} from "react-relay";
import {SelectLanguageRestrictedProps} from "./types";
import {useSelectLanguageRestrictedTranslations, SelectLanguageTranslationKey} from "./translations";
import {LysQueryProvider} from "lys-front/providers";
import {LysQueryRefInterface} from "lys-front/providers";
import {useLocale} from "lys-front/providers";
import {SelectLanguageRestrictedQuery} from "./__generated__/SelectLanguageRestrictedQuery.graphql";
import SelectElement from "@/components/elements/SelectElement";
import {SelectOption} from "@/components/elements/SelectElement/types";

/**
 * GraphQL query for languages
 */
const LanguagesQuery = graphql`
    query SelectLanguageRestrictedQuery($enabled: Boolean) {
        allLanguages(enabled: $enabled) {
            edges {
                node {
                    code
                }
            }
        }
    }
`;

/**
 * SelectLanguageRestricted component
 *
 * Restricted feature component (Layer 3) that provides:
 * - Permission-protected language selection
 * - GraphQL query via LysQueryProvider for languages
 * - Automatic translation of labels
 * - Wraps SelectElement with language options
 *
 * This is a restricted feature component (Layer 3) that:
 * - Uses LysQueryProvider to fetch enabled languages
 * - Transforms GraphQL data to SelectOption format
 * - Uses translation system for label and helperText
 * - Handles permission checking for data access
 */
const SelectLanguageRestricted: React.FC<SelectLanguageRestrictedProps> = (props) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useSelectLanguageRestrictedTranslations();
    const {locale} = useLocale();

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [queryRef, setQueryRef] = useState<LysQueryRefInterface | null>(null);

    /**
     * FR-only launch lock. When VITE_LOCK_LANGUAGE is "true", the language
     * selector is hidden everywhere it appears and the current app locale is
     * forced into the parent form. Since the selector is the only way to change
     * the locale, it stays at defaultLocale while locked. Reversible: unset the
     * flag and the selector comes back.
     */
    const isLanguageLocked = import.meta.env.VITE_LOCK_LANGUAGE === "true";

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Transform GraphQL data to SelectOption format for languages
     */
    const languageOptions: SelectOption[] = useMemo(() => {
        const data = queryRef?.data as SelectLanguageRestrictedQuery["response"] | undefined;

        if (!data?.allLanguages?.edges) {
            return [];
        }

        return data.allLanguages.edges.map((edge) => ({
            label: t(edge.node.code.toUpperCase() as SelectLanguageTranslationKey),
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

    /**
     * When locked, force the current app locale into the parent form. The guard
     * on props.value stops re-emitting once the parent holds the locale, so this
     * cannot loop even though FormFeature passes a fresh onChange each render.
     */
    useEffect(() => {
        if (isLanguageLocked && props.value !== locale) {
            props.onChange?.({target: {value: locale}} as React.ChangeEvent<HTMLSelectElement>);
        }
    }, [isLanguageLocked, locale, props.value, props.onChange]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    if (isLanguageLocked) {
        return null;
    }

    return (
        <LysQueryProvider
            query={LanguagesQuery}
            parameters={{enabled: true}}
            options={{fetchPolicy: 'store-or-network'}}
            ref={setQueryRef}
        >
            <SelectElement
                {...props}
                options={languageOptions}
                label={t("label")}
            />
        </LysQueryProvider>
    );
};

SelectLanguageRestricted.displayName = "SelectLanguageRestricted";

export default SelectLanguageRestricted;