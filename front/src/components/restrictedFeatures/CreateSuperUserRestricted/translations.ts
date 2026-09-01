import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Create Super User",
        fr: "Créer un super utilisateur"
    },
    successMessage: {
        en: "Super user created, an invitation email has been sent",
        fr: "Super utilisateur créé, un email d'invitation a été envoyé"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "CreateSuperUserRestricted",
    translations
);

export const createSuperUserRestrictedConfig = config;
export const useCreateSuperUserRestrictedTranslations = useTranslations;
export default config;
