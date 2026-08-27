import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    otherActions: {
        en: "Other actions",
        fr: "Autres actions"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ShowActionsFeature",
    translations
);

export const showActionsFeatureConfig = config;
export const useShowActionsFeatureTranslations = useTranslations;
export default config;