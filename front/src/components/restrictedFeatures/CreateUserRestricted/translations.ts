import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Create User",
        fr: "Créer un utilisateur"
    },
    successMessage: {
        en: "User created, an invitation email has been sent",
        fr: "Utilisateur créé, un email d'invitation a été envoyé"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "CreateUserRestricted",
    translations
);

export const createUserRestrictedConfig = config;
export const useCreateUserRestrictedTranslations = useTranslations;
export default config;