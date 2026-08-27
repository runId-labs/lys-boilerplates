import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Commitment",
        fr: "Engagement"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectCommitmentRestricted",
    translations
);

export const selectCommitmentRestrictedConfig = config;
export const useSelectCommitmentRestrictedTranslations = useTranslations;
export default config;
