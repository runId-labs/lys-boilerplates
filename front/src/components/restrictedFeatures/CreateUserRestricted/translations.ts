import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Create User",
        fr: "Créer un utilisateur"
    },
    successMessage: {
        en: "User created successfully",
        fr: "Utilisateur créé avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "CreateUserRestricted",
    translations
);

export const createUserRestrictedConfig = config;
export const useCreateUserRestrictedTranslations = useTranslations;
export default config;