import React, {useMemo} from "react";
import {ClientAdminFeatureProps} from "./types";
import {useClientAdminFeatureTranslations} from "./translations";
import CardElement from "@/components/elements/CardElement";
import ManageClientDropdownFeature from "@/components/features/ManageClientDropdownFeature";

/**
 * ClientAdminFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Client information display in card format
 * - Subscription/license plan information display
 * - ManageClientDropdownFeature for license management actions
 */
const ClientAdminFeature: React.FC<ClientAdminFeatureProps> = ({
    clientData
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useClientAdminFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Format date helper
     */
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString();
    };

    /**
     * Get plan name from license plan
     */
    const planName = useMemo(() => {
        if (clientData.licensePlan?.code) {
            return clientData.licensePlan.code;
        }
        return t("noPlan");
    }, [clientData.licensePlan, t]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <div className="d-flex flex-column gap-4">
            {/* Client Information Card */}
            <CardElement
                variant="widget"
                title={t("clientInfoTitle")}
                actions={
                    <ManageClientDropdownFeature
                        clientId={clientData.id}
                        ownerId={clientData.ownerId}
                        subscriptionId={clientData.subscription?.id ?? null}
                    />
                }
            >
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <div className="text-muted small">{t("labelName")}</div>
                        <div className="fw-semibold">{clientData.name}</div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-muted small">{t("labelPlan")}</div>
                        <div className="fw-semibold">{planName}</div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-muted small">{t("labelCreatedAt")}</div>
                        <div>{formatDate(clientData.createdAt)}</div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-muted small">{t("labelUpdatedAt")}</div>
                        <div>{formatDate(clientData.updatedAt)}</div>
                    </div>
                </div>
            </CardElement>
        </div>
    );
};

ClientAdminFeature.displayName = "ClientAdminFeature";

export default ClientAdminFeature;