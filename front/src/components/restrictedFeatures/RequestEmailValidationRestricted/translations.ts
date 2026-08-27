import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    verifyButton: {
        en: "Verify Email",
        fr: "Vérifier l'email"
    },
    successMessage: {
        en: "Verification email sent successfully. Please check your inbox.",
        fr: "Email de vérification envoyé avec succès. Veuillez vérifier votre boîte de réception."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "RequestEmailValidationRestricted",
    translations
);

export const requestEmailValidationRestrictedConfig = config;
export const useRequestEmailValidationRestrictedTranslations = useTranslations;