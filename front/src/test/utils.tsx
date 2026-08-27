import React, {ReactElement} from "react";
import {render, RenderOptions} from "@testing-library/react";
import {IntlProvider} from "react-intl";
import {I18nLocaleEnum} from "lys-front/types";
import {lysMessages} from "@/services/i18n/messages";

interface RenderWithIntlOptions extends Omit<RenderOptions, "wrapper"> {
    locale?: I18nLocaleEnum;
}

/**
 * Render helper that wraps the component under test in an IntlProvider
 * loaded with the project message table.
 *
 * Required for any component calling useTranslations()/useIntl()
 * (react-intl throws without a provider in the ancestry).
 */
const renderWithIntl = (ui: ReactElement, options?: RenderWithIntlOptions) => {
    const {locale = I18nLocaleEnum.en, ...renderOptions} = options ?? {};

    const wrapper = ({children}: {children: React.ReactNode}) => (
        <IntlProvider locale={locale} messages={lysMessages[locale]}>
            {children}
        </IntlProvider>
    );

    return render(ui, {...renderOptions, wrapper});
};

export default renderWithIntl;
