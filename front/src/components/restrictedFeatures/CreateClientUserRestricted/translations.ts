import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Create User",
        fr: "Créer un utilisateur"
    },
    successMessage: {
        en: "User created successfully",
        fr: "Utilisateur créé avec succès"
    },
    clientSectionTitle: {
        en: "Client",
        fr: "Client"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "CreateClientUserRestricted",
    translations
);

export const createClientUserRestrictedConfig = config;
export const useCreateClientUserRestrictedTranslations = useTranslations;
export default config;
