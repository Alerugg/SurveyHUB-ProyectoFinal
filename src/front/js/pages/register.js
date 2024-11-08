import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const newUser = {
            full_name: fullName,
            email: email,
            password_hash: password,
        };

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert("Registro exitoso.");
                navigate("/login");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un problema con el registro. Inténtelo de nuevo más tarde.");
        }
    };

    return (
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", minHeight: "100vh" }}>
            <div className="container mt-5">
                <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: "#ffffff", color: "#333333", borderRadius: "20px" }}>
                    <h2 className="text-center mb-4" style={{ color: "#6a0dad" }}>Registrarse</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre completo</label>
                            <input
                                type="text"
                                className="form-control"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#6a0dad", border: "none", borderRadius: "20px" }}>
                            Registrarse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
