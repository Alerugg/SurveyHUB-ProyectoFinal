import React, { useState, useContext } from "react";
import "../../styles/register.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

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
            <div className="container mt-5 d-flex justify-content-center">
                <div className="card shadow-sm border-0 p-4 register-card">
                    <h2 className="text-center mb-4">Registrarse</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre completo</label>
                            <input
                                type="text"
                                className="form-control register-input"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control register-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control register-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                className="form-control register-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-lg register-btn w-100">Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
