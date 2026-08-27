import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    pageName: {
        en: "Email Verification",
        fr: "Verification d'Email"
    },
    verifying: {
        en: "Verifying your email address...",
        fr: "Verification de votre adresse email..."
    },
    successMessage: {
        en: "Email verified successfully!",
        fr: "Email vérifie avec succès !"
    },
    missingToken: {
        en: "Missing verification token",
        fr: "Jeton de verification manquant"
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "VerifyEmailPage",
    translations
);

export const useVerifyEmailPageTranslations = useTranslations;
export default config.translation;
