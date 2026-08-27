import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    colorPickerAriaLabel: {
        en: "Color picker",
        fr: "Sélecteur de couleur"
    },
    hexColorCodeAriaLabel: {
        en: "Hex color code",
        fr: "Code couleur hexadécimal"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ColorPickerElement",
    translations
);

export const colorPickerElementConfig = config;
export const useColorPickerElementTranslations = useTranslations;
export default config;
