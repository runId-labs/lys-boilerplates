import {createComponentTranslations as lysCreateComponentTranslations} from "lys-front/tools";
import {I18nLocaleEnum} from "lys-front/types";
import {CommonTranslationKey} from "@/services/i18n/common";

export const createComponentTranslations = <T extends Record<string, Record<I18nLocaleEnum, string>>>(
    componentName: string,
    translations: T,
    pathBase?: string
) => lysCreateComponentTranslations<T, CommonTranslationKey>(componentName, translations, pathBase);
