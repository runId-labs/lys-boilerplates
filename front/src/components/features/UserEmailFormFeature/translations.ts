import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    email: {
        en: "Email Address",
        fr: "Adresse email"
    },
    submit: {
        en: "Update Email",
        fr: "Mettre à jour l'email"
    },
    emailError: {
        en: "Please enter a valid email address",
        fr: "Veuillez entrer une adresse email valide"
    },
    sameEmailError: {
        en: "New email must be different from current email",
        fr: "Le nouvel email doit être différent de l'email actuel"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UserEmailFormFeature",
    translations
);

export const userEmailFormFeatureConfig = config;
export const useUserEmailFormFeatureTranslations = useTranslations;