import React from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Login = () => {
    return (
        <div style={{ backgroundColor: "#2e1e38", padding: "20px", minHeight: "100vh", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <div className="container d-flex flex-row align-items-center justify-content-between" style={{ maxWidth: "1200px" }}>
                {/* Login Card */}
                <div className="card p-5" style={{ maxWidth: "400px", width: "100%", backgroundColor: "#ffffff", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <h1 className="fw-bold text-center mb-4" style={{ color: "#e2aaff", fontSize: "4rem" }}>E<span style={{ color: "#6a0dad" }}>vote</span></h1>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo" style={{ borderRadius: "10px" }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" placeholder="Ingresa tu contraseña" style={{ borderRadius: "10px" }} />
                            <div className="text-end mt-1">
                                <Link to="/forgot-password" style={{ color: "#6a0dad", fontSize: "0.9rem", textDecoration: "none" }}>Olvidó su contraseña?</Link>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#e2aaff", border: "none", borderRadius: "20px", padding: "10px" }}>Iniciar sesión</button>
                    </form>
                    <p className="mt-3 text-center">
                        ¿No tienes una cuenta? <Link to="/register" style={{ color: "#e2aaff", textDecoration: "none" }}>Regístrate aquí</Link>
                    </p>
                </div>
                {/* Illustration Image */}
                <div className="ms-5">
                    <img src="https://placehold.co/600x400" alt="Login Illustration" style={{ maxWidth: "100%", borderRadius: "20px" }} />
                </div>
            </div>
        </div>
    );
};