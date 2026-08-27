import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    dropZoneLabel: {
        en: "Drag and drop files here or click to select",
        fr: "Glissez-déposez des fichiers ici ou cliquez pour sélectionner"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "FileDropZoneElement",
    translations
);

export const fileDropZoneElementConfig = config;
export const useFileDropZoneElementTranslations = useTranslations;
export default config;
