import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    dialogTitle: {
        en: "Set a quota",
        fr: "Définir un quota"
    },
    dialogMessage: {
        en: "The quota applies to every client subscribed to this version, immediately.",
        fr: "Le quota s'applique immédiatement à tous les clients abonnés à cette version."
    },
    limitHelp: {
        en: "Leave empty for no limit.",
        fr: "Laissez vide pour ne pas limiter."
    },
    submit: {
        en: "Set quota",
        fr: "Définir le quota"
    },
    success: {
        en: "Quota updated",
        fr: "Quota mis à jour"
    },
    error: {
        en: "Unable to set the quota",
        fr: "Impossible de définir le quota"
    },
    invalidLimit: {
        en: "The limit must be a positive whole number",
        fr: "La limite doit être un nombre entier positif"
    }
} as const;

export type SetPlanVersionRuleTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "SetPlanVersionRuleRestricted",
    translations
);

export const setPlanVersionRuleRestrictedConfig = config;
export const useSetPlanVersionRuleRestrictedTranslations = useTranslations;
export default config;
