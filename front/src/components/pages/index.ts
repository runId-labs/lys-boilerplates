import {activatePage} from "./ActivatePage/config";
import {clientAdminPage} from "./ClientAdminPage/config";
import {homePage} from "./HomePage/config";
import {listAdminPage} from "./ListAdminPage/config";
import {listClientPage} from "./ListClientPage/config";
import {listClientUserPage} from "./ListClientUserPage/config";
import {listPlanVersionPage} from "./ListPlanVersionPage/config";
import {listSuperUserPage} from "./ListSuperUserPage/config";
import {loginPage} from "./LoginPage/config";
import {notFoundDefaultPage} from "./NotFoundDefaultPage/config";
import {resetPasswordPage} from "./ResetPasswordPage/config";
import {verifyEmailPage} from "./VerifyEmailPage/config";

const pages = {
    activatePage: activatePage,
    clientAdminPage: clientAdminPage,
    homePage: homePage,
    listAdminPage: listAdminPage,
    listClientPage: listClientPage,
    listClientUserPage: listClientUserPage,
    listPlanVersionPage: listPlanVersionPage,
    listSuperUserPage: listSuperUserPage,
    loginPage: loginPage,
    notFoundDefaultPage: notFoundDefaultPage,
    resetPasswordPage: resetPasswordPage,
    verifyEmailPage: verifyEmailPage,
};

export default pages;
