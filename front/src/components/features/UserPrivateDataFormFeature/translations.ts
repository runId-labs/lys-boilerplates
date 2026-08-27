import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    firstName: {
        en: "First Name",
        fr: "Prénom"
    },
    lastName: {
        en: "Last Name",
        fr: "Nom"
    },
    gender: {
        en: "Gender",
        fr: "Genre"
    },
    submit: {
        en: "Update Information",
        fr: "Mettre à jour les informations"
    },
    firstNameError: {
        en: "First name is required",
        fr: "Le prénom est requis"
    },
    lastNameError: {
        en: "Last name is required",
        fr: "Le nom est requis"
    },
    genderPlaceholder: {
        en: "Select your gender",
        fr: "Sélectionnez votre genre"
    },
    language: {
        en: "Language",
        fr: "Langue"
    },
    languagePlaceholder: {
        en: "Select your language",
        fr: "Sélectionnez votre langue"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UserPrivateDataFormFeature",
    translations
);

export const userPrivateDataFormFeatureConfig = config;
export const useUserPrivateDataFormFeatureTranslations = useTranslations;
export default config;
