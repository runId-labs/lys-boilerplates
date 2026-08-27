import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "Founder Customer programme",
        fr: "Programme Founder Customer"
    },
    explanation: {
        en: "30% off the catalogue price for the whole commitment, in exchange for letting us "
            + "use your data, once anonymised, for our research.",
        fr: "30 % de remise sur le tarif catalogue pendant toute la durée de l'engagement, "
            + "en contrepartie de l'exploitation de vos données, une fois anonymisées, pour "
            + "nos travaux de recherche."
    },
    acceptLabel: {
        en: "I accept the terms of the Founder Customer programme",
        fr: "J'accepte les conditions du programme Founder Customer"
    },
    linkText: {
        en: "Read the programme terms",
        fr: "Lire les conditions du programme"
    },
    error: {
        en: "Your acceptance could not be recorded, please try again",
        fr: "Votre acceptation n'a pas pu être enregistrée, réessayez"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "AcceptFounderCustomerRestricted",
    translations
);

export const acceptFounderCustomerRestrictedConfig = config;
export const useAcceptFounderCustomerRestrictedTranslations = useTranslations;
export default config;
