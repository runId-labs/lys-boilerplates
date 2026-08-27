import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    itemsPerPage: {
        en: "Items per page:",
        fr: "Éléments par page :"
    },
    showingRange: {
        en: "Showing {start}-{end} of {total}",
        fr: "Affichage {start}-{end} sur {total}"
    },
    previous: {
        en: "Previous",
        fr: "Précédent"
    },
    next: {
        en: "Next",
        fr: "Suivant"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "PaginationElement",
    translations
);

export const paginationElementConfig = config;
export const usePaginationElementTranslations = useTranslations;
export default config;