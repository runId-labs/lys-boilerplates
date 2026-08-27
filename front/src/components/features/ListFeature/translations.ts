import {createComponentTranslations} from "@/tools/translationTools";

// ListFeature is generic and doesn't need translations
// Translations are provided by parent components
const translations = {} as const;

const {config, useTranslations} = createComponentTranslations(
    "ListFeature",
    translations
);

export const listFeatureConfig = config;
export const useListFeatureTranslations = useTranslations;
export default config;