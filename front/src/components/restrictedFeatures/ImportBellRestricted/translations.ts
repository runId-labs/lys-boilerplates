import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    imports: {
        en: "Imports",
        fr: "Imports"
    },
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ImportBellRestricted",
    translations
);

export const importBellRestrictedConfig = config;
export const useImportBellRestrictedTranslations = useTranslations;
export default config;
