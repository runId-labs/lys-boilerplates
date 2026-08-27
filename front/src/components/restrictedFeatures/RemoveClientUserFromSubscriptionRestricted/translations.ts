import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    buttonText: {
        en: "Remove license",
        fr: "Retirer la licence"
    },
    successMessage: {
        en: "License removed successfully",
        fr: "Licence retirée avec succès"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "RemoveClientUserFromSubscriptionRestricted",
    translations
);

export const removeClientUserFromSubscriptionRestrictedConfig = config;
export const useRemoveClientUserFromSubscriptionRestrictedTranslations = useTranslations;
export default config;