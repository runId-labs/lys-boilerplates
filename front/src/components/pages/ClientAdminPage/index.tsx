import React, {useEffect, useRef} from "react";
import {PageProps} from "lys-front/types";
import {useAlertMessages} from "lys-front/providers";
import {useUrlQueries} from "lys-front/providers";
import ClientAdminRestricted from "@/components/restrictedFeatures/ClientAdminRestricted";
import {useClientAdminPageTranslations} from "./translation";

/**
 * ClientAdminPage
 * Administration section page - displays connected user's client organization
 */
const ClientAdminPage: React.FC<PageProps> = () => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {appliedParams, edit} = useUrlQueries();
    const alertMessages = useAlertMessages();
    const {t} = useClientAdminPageTranslations();
    const hasHandledPayment = useRef(false);

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Check for payment status in URL and show appropriate alert
     */
    useEffect(() => {
        const paymentStatus = appliedParams.get("payment");

        if (paymentStatus && !hasHandledPayment.current) {
            hasHandledPayment.current = true;

            // Clear the query param to avoid showing the message again on refresh
            edit("payment", null);

            switch (paymentStatus) {
                case "pending":
                    alertMessages.merge([{
                        text: t("paymentPending"),
                        level: "SUCCESS"
                    }]);
                    break;
                case "success":
                    alertMessages.merge([{
                        text: t("paymentSuccess"),
                        level: "SUCCESS"
                    }]);
                    break;
                case "failed":
                    alertMessages.merge([{
                        text: t("paymentFailed"),
                        level: "ERROR"
                    }]);
                    break;
                case "cancelled":
                    alertMessages.merge([{
                        text: t("paymentCancelled"),
                        level: "WARNING"
                    }]);
                    break;
            }
        }
    }, [appliedParams, edit, alertMessages, t]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return <ClientAdminRestricted />;
};

ClientAdminPage.displayName = "ClientAdminPage";

export default ClientAdminPage;