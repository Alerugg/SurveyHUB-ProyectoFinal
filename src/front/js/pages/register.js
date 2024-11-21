import React, { useState, useContext } from "react";
import "../../styles/register.css";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import RegisterLogo from "../../img/logoRegister.png"

export const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const newUser = {
            full_name: fullName,
            email: email,
            password: password,
        };

        try {
            // Step 1: Register the user
            const registerResponse = await fetch(process.env.BACKEND_URL + "/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (registerResponse.ok) {
                // Step 2: Automatically log the user in
                const loginResponse = await fetch(process.env.BACKEND_URL + "/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email, password: password }),
                });

                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    // Guardar token y actualizar el estado global del usuario
                    localStorage.setItem("token", loginData.token);
                    localStorage.setItem("user_id", loginData.user_id);
                    actions.login(loginData); // Esto actualiza el store con la información del usuario
                    alert("Registro e inicio de sesión exitosos. Bienvenid@!");
                    navigate("/user_logued"); // Redirige a la página de usuario logueado
                } else {
                    alert("Error al iniciar sesión automáticamente. Por favor, intente iniciar sesión manualmente.");
                    navigate("/login");
                }
            } else {
                const errorData = await registerResponse.json();
                alert(`Error en el registro: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un problema con el registro. Inténtelo de nuevo más tarde.");
        }
    };

    return (
        <div className="register-container">
            <img src={RegisterLogo} alt="Login" className="login-image-small" />
            <div className="register-form-container mt-5 d-flex justify-content-center">
                <h1 className="register-title text-center">
                    <span className="register-e">E</span>
                    <span className="register-vote">vote</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-reg">
                        <label className="form-label"></label>
                        <input
                            placeholder="Full name"
                            type="text"
                            className="form-control register-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-reg">
                        <label className="form-label"></label>
                        <input
                            placeholder="Email"
                            type="email"
                            className="form-control register-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-reg">
                        <label className="form-label"></label>
                        <input
                            placeholder="Password"
                            type="password"
                            className="form-control register-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-reg">
                        <label className="form-label"></label>
                        <input
                            placeholder="Confirm password"
                            type="password"
                            className="form-control register-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-lg register-btn w-100">Create account</button>
                    <div className="login-register">
                        Do you already have an account? <Link to="/login" className="signup-link">Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
