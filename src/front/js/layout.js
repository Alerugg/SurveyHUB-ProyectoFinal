import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import {HomeUserLogued} from "./pages/home_user_logued"
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Login } from "./pages/login";
import { UserProfile } from "./pages/userProfile";
import { CreateSurvey } from "./pages/createSurvey";
import { Register } from "./pages/register";
import SurveyResults from "./pages/surveyResults";
import { ForgotPassword } from "./pages/recoverPassword";




import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<HomeUserLogued />} path="/user_logued" />
                        <Route element={<SurveyResults/>} path="/surveys/:theid" />
                        <Route element={<Register />} path="/register" />
                        <Route element={< CreateSurvey/>} path="/create_survey" />
                        <Route element={<UserProfile/>} path="/profile" />
                        <Route element={<ForgotPassword />} path="/password_recovery" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theida" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
