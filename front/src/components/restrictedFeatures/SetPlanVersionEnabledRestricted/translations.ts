import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Enable
    enableTitle: {
        en: "Put this version back on sale",
        fr: "Remettre cette version en vente"
    },
    enableMessage: {
        en: "New subscriptions will land on this version. The version currently on sale for this plan is switched off, existing subscribers keep theirs.",
        fr: "Les nouvelles souscriptions se feront sur cette version. La version actuellement en vente pour cette offre est désactivée, les abonnés en cours gardent la leur."
    },
    enableSubmit: {
        en: "Put on sale",
        fr: "Mettre en vente"
    },

    // Disable
    disableTitle: {
        en: "Retire this version",
        fr: "Retirer cette version"
    },
    disableMessage: {
        en: "The version is no longer sold. Existing subscribers keep it and their price, but the plan has no version on sale until another one is published.",
        fr: "La version n'est plus vendue. Les abonnés en cours la conservent avec leur tarif, mais l'offre n'a plus de version en vente tant qu'une autre n'est pas publiée."
    },
    disableSubmit: {
        en: "Retire",
        fr: "Retirer"
    },

    // Feedback
    success: {
        en: "Availability updated",
        fr: "Disponibilité mise à jour"
    },
    error: {
        en: "Unable to change the availability",
        fr: "Impossible de modifier la disponibilité"
    }
} as const;

export type SetPlanVersionEnabledTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "SetPlanVersionEnabledRestricted",
    translations
);

export const setPlanVersionEnabledRestrictedConfig = config;
export const useSetPlanVersionEnabledRestrictedTranslations = useTranslations;
export default config;
