import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Create User",
        fr: "Créer un utilisateur"
    },
    successMessage: {
        en: "User created, an invitation email has been sent",
        fr: "Utilisateur créé, un email d'invitation a été envoyé"
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
