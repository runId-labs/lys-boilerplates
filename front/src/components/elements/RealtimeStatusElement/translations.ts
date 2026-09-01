import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    offline: {en: "Offline", fr: "Hors ligne"},
    offlineDetail: {
        en: "Live updates are interrupted. Reconnecting…",
        fr: "Les mises à jour en temps réel sont interrompues. Reconnexion en cours…"
    }
} as const;

const {config, useTranslations} = createComponentTranslations("RealtimeStatusElement", translations);

export const realtimeStatusElementConfig = config;
export const useRealtimeStatusElementTranslations = useTranslations;
export default config;
