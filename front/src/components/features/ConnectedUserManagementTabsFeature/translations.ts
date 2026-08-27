import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    privateData: {
        en: "Personal Information",
        fr: "Informations personnelles"
    },
    privateDataDescription: {
        en: "Update your personal information to keep your profile up to date.",
        fr: "Mettez à jour vos informations personnelles pour maintenir votre profil à jour."
    },
    email: {
        en: "Email Address",
        fr: "Adresse email"
    },
    password: {
        en: "Password",
        fr: "Mot de passe"
    },
    sso: {
        en: "SSO",
        fr: "SSO"
    },
    notifications: {
        en: "Notifications",
        fr: "Notifications"
    },
    notificationsDescription: {
        en: "Manage your email and in-app notification preferences.",
        fr: "Gérez vos préférences de notifications par email et dans l'application."
    },
    loading: {
        en: "Loading...",
        fr: "Chargement..."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "ConnectedUserManagementTabsFeature",
    translations
);

export const connectedUserManagementTabsFeatureConfig = config;
export const useConnectedUserManagementTabsFeatureTranslations = useTranslations;
