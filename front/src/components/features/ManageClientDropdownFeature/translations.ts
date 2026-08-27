import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Dropdown actions
    actionView: {
        en: "View client",
        fr: "Voir le client"
    },
    actionViewOwner: {
        en: "View owner",
        fr: "Voir le propriétaire"
    },
    actionAssignOffer: {
        en: "Subscribe manually",
        fr: "Abonner manuellement"
    },
    actionBillingMode: {
        en: "Bill manually",
        fr: "Facturer manuellement"
    },
    actionManageSubscription: {
        en: "View subscription",
        fr: "Voir l'abonnement"
    }
} as const;

export type ManageClientDropdownTranslationKey = keyof typeof translations;

const {config, useTranslations} = createComponentTranslations(
    "ManageClientDropdownFeature",
    translations
);

export const manageClientDropdownFeatureConfig = config;
export const useManageClientDropdownFeatureTranslations = useTranslations;
export default config;