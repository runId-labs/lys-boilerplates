import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Button
    buttonText: {
        en: "View",
        fr: "Voir"
    },

    // Offcanvas
    offcanvasTitle: {
        en: "Client Details",
        fr: "Détails du client"
    },

    // Tabs
    tabClientInfo: {
        en: "Client Information",
        fr: "Information client"
    },

    // Client info labels
    labelName: {
        en: "Name",
        fr: "Nom"
    },
    labelCreatedAt: {
        en: "Created at",
        fr: "Créé le"
    },
    labelUpdatedAt: {
        en: "Updated at",
        fr: "Mis à jour le"
    }
} as const;

export type GetClientTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "GetClientRestricted",
    translations
);

export const getClientRestrictedConfig = config;
export const useGetClientRestrictedTranslations = useTranslations;
export default config;