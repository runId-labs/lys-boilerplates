import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Field labels
    email: {
        en: "Email address",
        fr: "Adresse email"
    },
    password: {
        en: "Password",
        fr: "Mot de passe"
    },
    firstName: {
        en: "First name",
        fr: "Prénom"
    },
    lastName: {
        en: "Last name",
        fr: "Nom"
    },

    // Roles section
    rolesLabel: {
        en: "Roles",
        fr: "Rôles"
    },

    // Validation errors
    emailInvalid: {
        en: "Please enter a valid email address",
        fr: "Veuillez entrer une adresse email valide"
    },

    // Button
    submit: {
        en: "Create",
        fr: "Créer"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UserCreationFormFeature",
    translations
);

export const userCreationFormFeatureConfig = config;
export const useUserCreationFormFeatureTranslations = useTranslations;
export default config;
