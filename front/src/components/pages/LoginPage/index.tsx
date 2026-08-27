import React from "react";
import {PageProps} from "lys-front/types";
import {useConnectedUserInfo} from "lys-front/providers";
import LoginFeature from "../../features/LoginFeature";


const LoginPage: React.FC<PageProps> = () => {

    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {login} = useConnectedUserInfo();
    const [commitLogin, isLoginInFlight] = login;

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle login submission
     * Called by LoginFeature when the form is submitted with valid credentials
     */
    const handleLogin = (email: string, password: string) => {
        commitLogin(email, password);
    };

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return(
        <div className="login-page lys-page-centered">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <LoginFeature
                            onSubmit={handleLogin}
                            isLoading={isLoginInFlight}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;