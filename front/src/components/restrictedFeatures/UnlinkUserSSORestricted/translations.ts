import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    confirmMessage: {
        en: "Unlink your {providerName} account? You will need to sign in with your password or link it again to use SSO.",
        fr: "Délier votre compte {providerName} ? Vous devrez vous connecter avec votre mot de passe ou le relier pour réutiliser le SSO."
    },
    confirmButton: {
        en: "Unlink",
        fr: "Délier"
    },
    successMessage: {
        en: "Account unlinked.",
        fr: "Compte délié."
    },
    errorMessage: {
        en: "Unable to unlink the account.",
        fr: "Impossible de délier le compte."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "UnlinkUserSSORestricted",
    translations
);

export const unlinkUserSSORestrictedConfig = config;
export const useUnlinkUserSSORestrictedTranslations = useTranslations;
