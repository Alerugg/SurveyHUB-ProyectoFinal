import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css";

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const user = store.user; // Supongamos que la información del usuario ya se almacena en el estado global

    return (
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", minHeight: "100vh" }}>
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#6a0dad", color: "#ffffff", borderRadius: "20px" }}>
                    <h2 className="display-5 fw-bold">Perfil de Usuario</h2>
                </div>

                <div className="card shadow-sm border-0" style={{ backgroundColor: "#ffffff", color: "#333333", borderRadius: "20px", padding: "20px" }}>
                    <div className="card-body">
                        <h5 className="card-title">Datos de la Cuenta</h5>
                        <p><strong>Nombre completo:</strong> {user?.full_name || "Nombre no disponible"}</p>
                        <p><strong>Email:</strong> {user?.email || "Correo no disponible"}</p>
                        <p><strong>Fecha de creación:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Fecha no disponible"}</p>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-between">
                    <button className="btn btn-primary me-2" style={{ borderRadius: "20px" }} onClick={() => alert("Función de cambiar datos próximamente")}>Cambiar datos de la cuenta</button>
                    <button className="btn btn-warning me-2" style={{ borderRadius: "20px" }} onClick={() => alert("Función de cambiar contraseña próximamente")}>Cambiar contraseña</button>
                    <button className="btn btn-danger" style={{ borderRadius: "20px" }} onClick={() => alert("Función de eliminar cuenta próximamente")}>Eliminar cuenta</button>
                </div>
            </div>
        </div>
    );
};