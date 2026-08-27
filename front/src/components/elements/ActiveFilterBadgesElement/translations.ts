import {createComponentTranslations} from "@/tools/translationTools";

/**
 * ActiveFilterBadgesElement has no local translations
 * This file exists only to provide access to common() for translating filter values
 */
const translations = {} as const;

const {config, useTranslations} = createComponentTranslations(
    "ActiveFilterBadgesElement",
    translations
);

export const activeFilterBadgesElementConfig = config;
export const useActiveFilterBadgesElementTranslations = useTranslations;