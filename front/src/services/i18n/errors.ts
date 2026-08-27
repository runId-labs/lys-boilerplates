import {I18nLocaleEnum} from "lys-front/types";
import {isErrorKey as isLysErrorKey} from "lys-front/i18n";

// TODO: Add your project-specific error translations here
export const projectErrorTranslations = {
} satisfies Record<string, Record<I18nLocaleEnum, string>>;

export type ProjectErrorKey = keyof typeof projectErrorTranslations;

export function isErrorKey(key: string): boolean {
    return isLysErrorKey(key) || key in projectErrorTranslations;
}
