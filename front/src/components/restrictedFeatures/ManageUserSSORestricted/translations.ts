import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    title: {
        en: "SSO connections",
        fr: "Connexions SSO"
    },
    description: {
        en: "Link an SSO provider to sign in without a password, or unlink it to require a password again.",
        fr: "Liez un fournisseur SSO pour vous connecter sans mot de passe, ou déliez-le pour redemander un mot de passe."
    },
    linked: {
        en: "Linked",
        fr: "Lié"
    },
    linkedSince: {
        en: "Linked since",
        fr: "Lié depuis le"
    },
    linkButton: {
        en: "Link",
        fr: "Lier"
    },
    unlinkButton: {
        en: "Unlink",
        fr: "Délier"
    },
    dialogTitle: {
        en: "Unlink SSO account",
        fr: "Délier le compte SSO"
    },
    empty: {
        en: "No SSO provider is configured.",
        fr: "Aucun fournisseur SSO n'est configuré."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ManageUserSSORestricted",
    translations
);

export const manageUserSSORestrictedConfig = config;
export const useManageUserSSORestrictedTranslations = useTranslations;
