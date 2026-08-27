import {commonTranslations} from "./common";
import {projectErrorTranslations} from "./errors";
import {errorTranslations} from "lys-front/i18n";
import {messagesTranslations} from "lys-front/i18n";

const i18n = {
    common: {
        translation: commonTranslations
    },
    errors: {
        translation: {...errorTranslations, ...projectErrorTranslations}
    },
    messages: {
        translation: messagesTranslations
    }
};

export default i18n;
