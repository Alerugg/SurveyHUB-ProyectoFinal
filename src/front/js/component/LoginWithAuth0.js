import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import loginImage from "../../img/login.png";
import "../../styles/login.css";

export const Login = () => {
    const { loginWithRedirect, user: auth0User, isAuthenticated, isLoading } = useAuth0();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && auth0User) {
            setIsProcessing(true);
            
            // Construir datos de usuario usando nickname como base
            const userData = {
                ...auth0User,
                email: auth0User.email || `${auth0User.nickname}@gmail.com`,
                full_name: auth0User.name || auth0User.nickname
            };

            console.log("Datos de usuario preparados para sincronización:", userData);

            actions.handleAuth0Login(userData)
                .then(() => {
                    console.log("Login exitoso con Auth0");
                    navigate('/user_logued');
                })
                .catch(err => {
                    console.error('Error en sincronización:', err);
                    setError('Error al sincronizar con el sistema. Por favor, intente nuevamente.');
                })
                .finally(() => {
                    setIsProcessing(false);
                });
        }
    }, [isAuthenticated, auth0User]);

    const handleAuth0Login = async () => {
        try {
            setError(null);
            setIsProcessing(true);
            await loginWithRedirect({
                authorizationParams: {
                    audience: "https://dev-qn1i850gfvm5fcb4.eu.auth0.com/api/v2/",
                    scope: "openid profile email"
                },
                appState: { 
                    returnTo: '/user_logued'
                }
            });
        } catch (error) {
            console.error('Error en login Auth0:', error);
            setError('No se pudo iniciar sesión con Auth0. Por favor, intente nuevamente.');
            setIsProcessing(false);
        }
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);
        
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error en login: ${response.status}`);
            }

            const data = await response.json();
            await actions.login(data);
            navigate("/user_logued");
        } catch (err) {
            console.error('Error en login manual:', err);
            setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Redireccionar si ya está autenticado
    useEffect(() => {
        if (localStorage.getItem("jwt-token")) {
            navigate("/user_logued");
        }
    }, []);

    const isButtonDisabled = isLoading || isProcessing;

    return (
        <div className="login-container">
            <img src={loginImage} alt="Login" className="login-image-small" />
            <div className="login-form-container">
                <h1 className="login-title">
                    <span className="highlight-e">E</span>
                    <span className="highlight-vote">vote</span>
                </h1>

                <button 
                    onClick={handleAuth0Login}
                    className="btn btn-primary auth0-btn mb-3"
                    disabled={isButtonDisabled}
                >
                    {isButtonDisabled ? (
                        <span>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Procesando...
                        </span>
                    ) : (
                        <span>
                            <i className="fas fa-lock me-2"></i>
                            Continuar con Github
                        </span>
                    )}
                </button>

                <div className="divider">o</div>

                <form onSubmit={handleManualLogin}>
                    <div className="form-group-placeholder">
                        <input
                            type="email"
                            className="form-control email-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isButtonDisabled}
                            required
                        />
                        <input
                            type="password"
                            className="form-control password-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isButtonDisabled}
                            required
                        />
                    </div>
                    <div className="form-group d-flex justify-content-between">
                        <Link 
                            to="/forgot-password" 
                            className="forgot-password-link"
                            tabIndex={isButtonDisabled ? -1 : 0}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <button 
                        type="submit" 
                        className="btn login-btn"
                        disabled={isButtonDisabled}
                    >
                        {isButtonDisabled ? (
                            <span>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Iniciando sesión...
                            </span>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                    </div>
                )}
                
                <div className="signup-prompt">
                    ¿No tienes una cuenta? {" "}
                    <Link 
                        to="/register" 
                        className="signup-link"
                        tabIndex={isButtonDisabled ? -1 : 0}
                    >
                        Regístrate
                    </Link>
                </div>
            </div>
            <div 
                className="login-image" 
                style={{ backgroundImage: `url(${loginImage})` }}
                role="img"
                aria-label="Login illustration"
            />
        </div>
    );
};