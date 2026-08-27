import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Create Super User",
        fr: "Créer un super utilisateur"
    },
    successMessage: {
        en: "Super user created successfully",
        fr: "Super utilisateur créé avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "CreateSuperUserRestricted",
    translations
);

export const createSuperUserRestrictedConfig = config;
export const useCreateSuperUserRestrictedTranslations = useTranslations;
export default config;
