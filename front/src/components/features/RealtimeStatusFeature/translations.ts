import {createComponentTranslations} from "@/tools/translationTools";

const translations = {} as const;

const {config, useTranslations} = createComponentTranslations("RealtimeStatusFeature", translations);

export const realtimeStatusFeatureConfig = config;
export const useRealtimeStatusFeatureTranslations = useTranslations;
export default config;
