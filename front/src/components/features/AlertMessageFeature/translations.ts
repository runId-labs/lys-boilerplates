import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Alert level titles
    levelCritical: {
        en: "Critical Error",
        fr: "Erreur Critique"
    },
    levelError: {
        en: "Error",
        fr: "Erreur"
    },
    levelWarning: {
        en: "Warning",
        fr: "Avertissement"
    },
    levelInfo: {
        en: "Information",
        fr: "Information"
    },
    levelSuccess: {
        en: "Success",
        fr: "Succès"
    },

    // Relative timestamps
    justNow: {
        en: "Just now",
        fr: "À l'instant"
    },
    secondsAgo: {
        en: "{count} second ago",
        fr: "Il y a {count} seconde"
    },
    secondsAgoPlural: {
        en: "{count} seconds ago",
        fr: "Il y a {count} secondes"
    },
    minuteAgo: {
        en: "{count} minute ago",
        fr: "Il y a {count} minute"
    },
    minutesAgo: {
        en: "{count} minutes ago",
        fr: "Il y a {count} minutes"
    },
    hourAgo: {
        en: "{count} hour ago",
        fr: "Il y a {count} heure"
    },
    hoursAgo: {
        en: "{count} hours ago",
        fr: "Il y a {count} heures"
    }
};

const {config, useTranslations} = createComponentTranslations(
    "AlertMessageFeature",
    translations
);

export const alertMessageFeatureConfig = config;
export const useAlertMessageTranslations = useTranslations;