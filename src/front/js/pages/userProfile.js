import React, { useContext } from "react";
import "../../styles/userProfile.css";
import { Context } from "../store/appContext";

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const user = store.user; // Supongamos que la información del usuario ya se almacena en el estado global

    return (
        <div className="user-profile-container">
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4 header-section">
                    <h2 className="display-5 fw-bold">Perfil de Usuario</h2>
                </div>

                <div className="card shadow-sm border-0 user-details-card">
                    <div className="card-body">
                        <h5 className="card-title">Datos de la Cuenta</h5>
                        <p><strong>Nombre completo:</strong> {user?.full_name || "Nombre no disponible"}</p>
                        <p><strong>Email:</strong> {user?.email || "Correo no disponible"}</p>
                        <p><strong>Fecha de creación:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Fecha no disponible"}</p>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-between">
                    <button className="btn btn-primary update-account-btn me-2">Cambiar datos de la cuenta</button>
                    <button className="btn btn-warning change-password-btn me-2">Cambiar contraseña</button>
                    <button className="btn btn-danger delete-account-btn">Eliminar cuenta</button>
                </div>
            </div>
        </div>
    );
};