import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    header: {
        en: "The new password must contain, at least",
        fr: "Le nouveau mot de passe doit contenir, au moins"
    },
    atLeast1SmallLetter: {
        en: "1 small letter",
        fr: "1 caractère en minuscule"
    },
    atLeast1CapitalLetter: {
        en: "1 capital letter",
        fr: "1 caractère en majuscule"
    },
    atLeast1Number: {
        en: "1 number",
        fr: "1 chiffre"
    },
    atLeast8Characters: {
        en: "8 characters",
        fr: "8 caractères"
    },
    atLeast1SpecialCharacter: {
        en: "1 special character (optional)",
        fr: "1 caractère spécial (optionnel)"
    },
    atLeast12Characters: {
        en: "12 characters (optional)",
        fr: "12 caractères (optionnel)"
    },
    veryWeak: {
        en: "Very weak",
        fr: "Très faible"
    },
    weak: {
        en: "Weak",
        fr: "Faible"
    },
    good: {
        en: "Good",
        fr: "Bon"
    },
    strong: {
        en: "Strong",
        fr: "Fort"
    },
    veryStrong: {
        en: "Very strong",
        fr: "Très fort"
    },
    passwordConfirmation: {
        en: "Confirmation password",
        fr: "Mot de passe de confirmation"
    },
    passwordConfirmationLabel: {
        en: "The confirmation password is valid",
        fr: "Mot de passe de confirmation valide"
    },
    validationRules: {
        en: "Password validation rules",
        fr: "Règles de validation du mot de passe"
    }
};

const {config, useTranslations} = createComponentTranslations(
    "PasswordCheckerFeature",
    translations
);

export const passwordCheckerFeatureConfig = config;
export const usePasswordCheckerFeatureTranslations = useTranslations;