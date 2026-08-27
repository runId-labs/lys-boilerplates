import {signUpRestrictedConfig} from "./SignUpRestricted/translations";
import {updateUserEmailRestrictedConfig} from "./UpdateUserEmailRestricted/translations";
import {requestEmailValidationRestrictedConfig} from "./RequestEmailValidationRestricted/translations";
import {updateUserPasswordRestrictedConfig} from "./UpdateUserPasswordRestricted/translations";
import {updateUserPrivateDataRestrictedConfig} from "./UpdateUserPrivateDataRestricted/translations";
import {updateUserEventPreferencesRestrictedConfig} from "./UpdateUserEventPreferencesRestricted/translations";
import {updateUserRolesRestrictedConfig} from "./UpdateUserRolesRestricted/translations";
import {listAdminRestrictedConfig} from "./ListAdminRestricted/translations";
import {selectLanguageRestrictedConfig} from "./SelectLanguageRestricted/translations";
import {selectGenderRestrictedConfig} from "./SelectGenderRestricted/translations";
import {selectRoleRestrictedConfig} from "./SelectRoleRestricted/translations";
import {selectClientRestrictedConfig} from "./SelectClientRestricted/translations";
import {getAdminRestrictedConfig} from "./GetAdminRestricted/translations";
import {updateClientUserPrivateDataRestrictedConfig} from "./UpdateClientUserPrivateDataRestricted/translations";
import {updateClientUserEmailRestrictedConfig} from "./UpdateClientUserEmailRestricted/translations";
import {updateClientUserRolesRestrictedConfig} from "./UpdateClientUserRolesRestricted/translations";
import {getClientUserRestrictedConfig} from "./GetClientUserRestricted/translations";
import {listClientUserRestrictedConfig} from "./ListClientUserRestricted/translations";
import {listClientRestrictedConfig} from "./ListClientRestricted/translations";
import {getClientRestrictedConfig} from "./GetClientRestricted/translations";
import {updateClientRestrictedConfig} from "./UpdateClientRestricted/translations";
import {getUserRestrictedConfig} from "./GetUserRestricted/translations";
import {listSuperUserRestrictedConfig} from "./ListSuperUserRestricted/translations";
import {chatbotRestrictedConfig} from "./ChatbotRestricted/translations";
import {updateSuperUserPrivateDataRestrictedConfig} from "./UpdateSuperUserPrivateDataRestricted/translations";
import {updateSuperUserEmailRestrictedConfig} from "./UpdateSuperUserEmailRestricted/translations";
import {getSuperUserRestrictedConfig} from "./GetSuperUserRestricted/translations";
import {createSuperUserRestrictedConfig} from "./CreateSuperUserRestricted/translations";
import {createUserRestrictedConfig} from "./CreateUserRestricted/translations";
import {createClientUserRestrictedConfig} from "./CreateClientUserRestricted/translations";
import {getSubscriptionRestrictedConfig} from "./GetSubscriptionRestricted/translations";
import {listActiveLicensePlansRestrictedConfig} from "./ListActiveLicensePlansRestricted/translations";
import {subscribeToPlanRestrictedConfig} from "./SubscribeToPlanRestricted/translations";
import {addClientUserToSubscriptionRestrictedConfig} from "./AddClientUserToSubscriptionRestricted/translations";
import {removeClientUserFromSubscriptionRestrictedConfig} from "./RemoveClientUserFromSubscriptionRestricted/translations";
import {notificationBellRestrictedConfig} from "./NotificationBellRestricted/translations";
import {importBellRestrictedConfig} from "./ImportBellRestricted/translations";
import {importListRestrictedConfig} from "./ImportListRestricted/translations";
import {selectNotificationSeverityRestrictedConfig} from "./SelectNotificationSeverityRestricted/translations";
import {listPlanVersionRestrictedConfig} from "./ListPlanVersionRestricted/translations";
import {selectLicensePlanRestrictedConfig} from "./SelectLicensePlanRestricted/translations";
import {createPlanVersionRestrictedConfig} from "./CreatePlanVersionRestricted/translations";
import {selectCommitmentRestrictedConfig} from "./SelectCommitmentRestricted/translations";
import {acceptFounderCustomerRestrictedConfig} from "./AcceptFounderCustomerRestricted/translations";
import {selectDiscountRestrictedConfig} from "./SelectDiscountRestricted/translations";
import {selectPlanVersionPriceRestrictedConfig} from "./SelectPlanVersionPriceRestricted/translations";
import {subscribeClientManuallyRestrictedConfig} from "./SubscribeClientManuallyRestricted/translations";
import {setSubscriptionBillingModeRestrictedConfig} from "./SetSubscriptionBillingModeRestricted/translations";
import {setPlanVersionRuleRestrictedConfig} from "./SetPlanVersionRuleRestricted/translations";
import {setPlanVersionEnabledRestrictedConfig} from "./SetPlanVersionEnabledRestricted/translations";
import {clientAdminRestrictedConfig} from "./ClientAdminRestricted/translations";
import {manageUserSSORestrictedConfig} from "./ManageUserSSORestricted/translations";
import {unlinkUserSSORestrictedConfig} from "./UnlinkUserSSORestricted/translations";

const restrictedFeatures = {
    signUpRestricted: signUpRestrictedConfig,
    updateUserEmailRestricted: updateUserEmailRestrictedConfig,
    requestEmailValidationRestricted: requestEmailValidationRestrictedConfig,
    updateUserPasswordRestricted: updateUserPasswordRestrictedConfig,
    updateUserPrivateDataRestricted: updateUserPrivateDataRestrictedConfig,
    updateUserEventPreferencesRestricted: updateUserEventPreferencesRestrictedConfig,
    updateUserRolesRestricted: updateUserRolesRestrictedConfig,
    listAdminRestricted: listAdminRestrictedConfig,
    selectLanguageRestricted: selectLanguageRestrictedConfig,
    selectGenderRestricted: selectGenderRestrictedConfig,
    selectRoleRestricted: selectRoleRestrictedConfig,
    selectClientRestricted: selectClientRestrictedConfig,
    getAdminRestricted: getAdminRestrictedConfig,
    updateClientUserPrivateDataRestricted: updateClientUserPrivateDataRestrictedConfig,
    updateClientUserEmailRestricted: updateClientUserEmailRestrictedConfig,
    updateClientUserRolesRestricted: updateClientUserRolesRestrictedConfig,
    getClientUserRestricted: getClientUserRestrictedConfig,
    listClientUserRestricted: listClientUserRestrictedConfig,
    listClientRestricted: listClientRestrictedConfig,
    getClientRestricted: getClientRestrictedConfig,
    updateClientRestricted: updateClientRestrictedConfig,
    getUserRestricted: getUserRestrictedConfig,
    listSuperUserRestricted: listSuperUserRestrictedConfig,
    chatbotRestricted: chatbotRestrictedConfig,
    updateSuperUserPrivateDataRestricted: updateSuperUserPrivateDataRestrictedConfig,
    updateSuperUserEmailRestricted: updateSuperUserEmailRestrictedConfig,
    getSuperUserRestricted: getSuperUserRestrictedConfig,
    createSuperUserRestricted: createSuperUserRestrictedConfig,
    createUserRestricted: createUserRestrictedConfig,
    createClientUserRestricted: createClientUserRestrictedConfig,
    getSubscriptionRestricted: getSubscriptionRestrictedConfig,
    listActiveLicensePlansRestricted: listActiveLicensePlansRestrictedConfig,
    subscribeToPlanRestricted: subscribeToPlanRestrictedConfig,
    addClientUserToSubscriptionRestricted: addClientUserToSubscriptionRestrictedConfig,
    removeClientUserFromSubscriptionRestricted: removeClientUserFromSubscriptionRestrictedConfig,
    notificationBellRestricted: notificationBellRestrictedConfig,
    importBellRestricted: importBellRestrictedConfig,
    importListRestricted: importListRestrictedConfig,
    selectNotificationSeverityRestricted: selectNotificationSeverityRestrictedConfig,
    listPlanVersionRestricted: listPlanVersionRestrictedConfig,
    selectLicensePlanRestricted: selectLicensePlanRestrictedConfig,
    createPlanVersionRestricted: createPlanVersionRestrictedConfig,
    selectCommitmentRestricted: selectCommitmentRestrictedConfig,
    acceptFounderCustomerRestricted: acceptFounderCustomerRestrictedConfig,
    selectDiscountRestricted: selectDiscountRestrictedConfig,
    selectPlanVersionPriceRestricted: selectPlanVersionPriceRestrictedConfig,
    subscribeClientManuallyRestricted: subscribeClientManuallyRestrictedConfig,
    setSubscriptionBillingModeRestricted: setSubscriptionBillingModeRestrictedConfig,
    setPlanVersionRuleRestricted: setPlanVersionRuleRestrictedConfig,
    setPlanVersionEnabledRestricted: setPlanVersionEnabledRestrictedConfig,
    clientAdminRestricted: clientAdminRestrictedConfig,
    manageUserSSORestricted: manageUserSSORestrictedConfig,
    unlinkUserSSORestricted: unlinkUserSSORestrictedConfig,
};

export default restrictedFeatures;
