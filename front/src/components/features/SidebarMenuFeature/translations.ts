import {createComponentTranslations} from "@/tools/translationTools";

const translations = {} as const;

const {config, useTranslations} = createComponentTranslations(
    "SidebarMenuFeature",
    translations
);

export const sidebarMenuFeatureConfig = config;
export const useSidebarMenuFeatureTranslations = useTranslations;
export default config;
