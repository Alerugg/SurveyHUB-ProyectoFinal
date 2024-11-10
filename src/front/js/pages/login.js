import React, { useState } from "react";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";

// Función login para hacer la solicitud al endpoint de login
const login = async (email, password) => {
    try {
        // Log para depurar los valores que se envían
        console.log("Enviando email:", email, "y password:", password);

        const resp = await fetch("https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3001.app.github.dev/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password }) // Enviando el cuerpo correctamente
        });

        console.log("Estado de la respuesta:", resp.status);

        if (!resp.ok) {
            // Manejo de errores en base a los códigos de respuesta
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

        // Almacenar el token JWT en el localStorage
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await login(email, password);
            console.log("Login exitoso:", data.message);
            navigate("/user_logued"); // Redirige al área protegida o a otra página
        } catch (err) {
            setError(err.message); // Mostrar el mensaje de error en la interfaz
        }
    };

    return (
        <div style={{ backgroundColor: "#1e1f24", padding: "20px", minHeight: "100vh" }}>
            <div className="login-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
                <h2>Login</h2>
                {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
                    >
                        Login
                    </button>
                </form>
                <p style={{ marginTop: "10px" }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};
