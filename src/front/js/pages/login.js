import React from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Login = () => {
    return (
        <div style={{ backgroundColor: "#1e1f24", padding: "20px", minHeight: "100vh" }}>
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                    <h1 className="display-4 fw-bold">Iniciar sesión en PulseSurvey</h1>
                    <p className="lead">Accede a tu cuenta para comenzar a crear y participar en encuestas.</p>
                </div>
                <div className="card p-4 mt-4 mx-auto" style={{ maxWidth: "400px", backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo" style={{ backgroundColor: "#1e1f24", border: "1px solid #6a0dad", borderRadius: "10px", color: "#ffffff" }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" placeholder="Ingresa tu contraseña" style={{ backgroundColor: "#1e1f24", border: "1px solid #6a0dad", borderRadius: "10px", color: "#ffffff" }} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#6a0dad", border: "none", borderRadius: "20px" }}>Iniciar sesión</button>
                    </form>
                    <p className="mt-3 text-center">
                        ¿No tienes una cuenta? <Link to="/register" style={{ color: "#6a0dad", textDecoration: "none" }}>Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
