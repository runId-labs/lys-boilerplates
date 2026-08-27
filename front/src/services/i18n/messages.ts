import {generateI18nMessage} from "lys-front/tools";
import {I18nLocaleEnum} from "lys-front/types";
import lys from "../../index";

const table = {
    lys
};

export const lysMessages = generateI18nMessage(Object.values(I18nLocaleEnum), table)
