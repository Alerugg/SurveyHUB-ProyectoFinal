import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { HomeUserLogued } from "./pages/home_user_logued";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Context } from "./store/appContext";
import { Login } from "./pages/login";
import { UserProfile } from "./pages/userProfile";
import { CreateSurvey } from "./pages/createSurvey";
import { Register } from "./pages/register";
import { SurveyResults } from "./pages/surveyResults";
import { ForgotPassword } from "./pages/recoverPassword";
import { AvailableSurveys } from "./pages/surveys";
import UserDashboard from "./pages/dashBoard";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import injectContext from "./store/appContext";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { store, actions } = useContext(Context);
    const { isAuthenticated, user, isLoading } = useAuth0();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const syncAuth0User = async () => {
            console.group("Auth0 Estado en Layout");
            console.log("isAuthenticated:", isAuthenticated);
            console.log("user:", user);
            console.log("store.isAuthenticated:", store.isAuthenticated);
            console.log("isLoading:", isLoading);

            if (isAuthenticated && user && !isSyncing) {
                try {
                    setIsSyncing(true);
                    console.log("Iniciando sincronización con Auth0...");
                    await actions.handleAuth0Login(user);
                    console.log("Sincronización completada");
                } catch (error) {
                    console.error("Error en sincronización:", error);
                } finally {
                    setIsSyncing(false);
                }
            }
            console.groupEnd();
        };

        syncAuth0User();
    }, [isAuthenticated, user, isLoading]);

    // Esperar mientras se carga Auth0
    if (isLoading) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>;
    }

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<AvailableSurveys />} path="/surveys" />
                        <Route 
                            path="/user_logued" 
                            element={
                                isAuthenticated || store.isAuthenticated ? 
                                <HomeUserLogued /> : 
                                <Navigate to="/login" />
                            } 
                        />
                        <Route 
                            path="/profile" 
                            element={store.isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/dashboard" 
                            element={store.isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/create_survey" 
                            element={store.isAuthenticated ? <CreateSurvey /> : <Navigate to="/login" />} 
                        />
                        <Route element={<SurveyResults/>} path="/surveys/:id"/>
                        <Route element={<ForgotPassword/>} path="/forgot-password" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);