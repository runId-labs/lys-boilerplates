import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Login",
        fr: "Connexion"
    },
    email: {
        en: "Email",
        fr: "Email"
    },
    emailError: {
        en: "Please enter a valid email address",
        fr: "Veuillez saisir une adresse email valide"
    },
    password: {
        en: "Password",
        fr: "Mot de passe"
    },
    passwordError: {
        en: "Password is required",
        fr: "Le mot de passe est requis"
    },
    submit: {
        en: "Sign in",
        fr: "Se connecter"
    }
};

const {config, useTranslations} = createComponentTranslations(
    "LoginFeature",
    translations
);

export const loginFeatureConfig = config;
export const useLoginTranslations = useTranslations;
