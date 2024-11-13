import React, { useState, useEffect } from "react";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import loginImage from '/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/login.png';
import { useAuth0 } from "@auth0/auth0-react"; 

// Función para hacer la solicitud al endpoint de login
const performLogin = async (email, password) => {
    try {
        console.log("Enviando email:", email, "y password:", password);

        const resp = await fetch("https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3001.app.github.dev/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

        console.log("Estado de la respuesta:", resp.status);

        if (!resp.ok) {
            if (resp.status === 401) {
                throw new Error("Credenciales inválidas");
            } else if (resp.status === 400) {
                throw new Error("Formato de email o contraseña inválido");
            } else if (resp.status === 405) {
                throw new Error("Método no permitido en el servidor");
            } else {
                throw new Error("Hubo un problema en la solicitud de login");
            }
        }

        const data = await resp.json();
        console.log("Datos de respuesta del login:", data);

        localStorage.setItem("jwt-token", data.token);

        return data;

    } catch (err) {
        console.error("Error durante el login:", err.message);
        throw err;
    }
};

// Componente de Login
export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { loginWithRedirect } = useAuth0(); 

    // useEffect(() => {
    //     // Inicializar Auth0 Client solo cuando el componente se monta
    //     const initAuth0 = async () => {
    //         try {
    //             const auth0 = new Auth0Client({
    //                 domain: "dev-pc4ip6ajno471us8.auth0.com",
    //                 client_id: "4GEmDYtNKQSRvu8H3yQNbumneMDQXCQV",
    //                 redirect_uri: window.location.origin + "/callback" // URL de callback
    //             });

    //             // Si ya hay una respuesta de Auth0, maneja la redirección
    //             if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    //                 const result = await auth0.handleRedirectCallback();
    //                 navigate("/user_logued"); // Redirige al usuario después de que se loguea
    //             }
    //         } catch (e) {
    //             setError("Error al inicializar Auth0: " + e.message);
    //         }
    //     };

    //     initAuth0();
    // }, [navigate]);

    // // Función para iniciar sesión con Auth0
    // const loginWithAuth0 = async () => {
    //     try {
    //         const auth0 = new Auth0Client({
    //             domain: "dev-pc4ip6ajno471us8.auth0.com",
    //             client_id: "4GEmDYtNKQSRvu8H3yQNbumneMDQXCQV",
    //             redirect_uri: window.location.origin + "/callback" // URL de callback
    //         });
    //         await auth0.loginWithRedirect(); // Redirige al usuario al flujo de login de Auth0
    //     } catch (e) {
    //         setError("Error al iniciar sesión con Auth0: " + e.message);
    //     }
    // };

    // Función de submit para el login tradicional
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await performLogin(email, password);
            console.log("Login exitoso:", data.message);
            navigate("/user_logued"); // Redirige al área protegida o a otra página
        } catch (err) {
            setError(err.message); // Mostrar el mensaje de error en la interfaz
        }
    };

    return (
        <div className="login-container">
            <img src={loginImage} alt="Login" className="login-image-small" />

            <div className="login-form-container">
                <h1 className="login-title">
                    <span className="highlight-e">E</span>
                    <span className="highlight-vote">vote</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-placeholder">
                        <input
                            type="email"
                            className="form-control email-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className="form-control password-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group d-flex justify-content-between">
                        <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
                    </div>
                    <button type="submit" className="btn login-btn">Log in</button>
                </form>
                {error && <div className="error-message">{error}</div>}
                <div className="signup-prompt">
                    Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => loginWithRedirect()}>
                        Login with Auth0
                </button>
            </div>
            <div className="login-image" style={{ backgroundImage: `url(${loginImage})` }}></div>
        </div>
    );
};
