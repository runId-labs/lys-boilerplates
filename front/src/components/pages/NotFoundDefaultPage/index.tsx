import React from "react";
import {useIntl} from "react-intl";
import {PageProps} from "lys-front/types";
import PageContainerElement from "@/components/elements/PageContainerElement";

const NotFoundDefaultPage: React.FC<PageProps> = () => {

    const transPrefix = "lys.components.pages.notFoundDefaultPage.";

    // translation hook
    const intl = useIntl();

    /*******************************************************************************************************************
     *                                                  Render
     * ****************************************************************************************************************/

    return (
        <PageContainerElement>
            <h1>{intl.formatMessage({id: transPrefix + "Page not found"})}</h1>
        </PageContainerElement>
    );
};

export default NotFoundDefaultPage;