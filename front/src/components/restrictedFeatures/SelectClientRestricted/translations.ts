import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    label: {
        en: "Client",
        fr: "Client"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SelectClientRestricted",
    translations
);

export const selectClientRestrictedConfig = config;
export const useSelectClientRestrictedTranslations = useTranslations;
export default config;