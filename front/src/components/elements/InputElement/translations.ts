import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    clearInputAriaLabel: {
        en: "Clear input",
        fr: "Effacer le champ"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "InputElement",
    translations
);

export const inputElementConfig = config;
export const useInputElementTranslations = useTranslations;
export default config;
