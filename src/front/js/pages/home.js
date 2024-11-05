import React from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import example from "/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/roadmapexample.png"




export const Home = () => {
    return (
        <div style={{ backgroundColor: "#1e1f24", padding: "20px", minHeight: "100vh" }}>
            {/* Header Section */}
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                    <h1 className="display-4 fw-bold">Bienvenido a PulseSurvey</h1>
                    <p className="lead">Descubre cómo nuestras encuestas pueden ayudarte a obtener información valiosa y mejorar tus decisiones.</p>
                    <div className="mt-4">
                        <Link to="/login" className="btn btn-primary btn-lg mx-2" style={{ backgroundColor: "#6a0dad", border: "none", borderRadius: "20px" }}>Iniciar sesión</Link>
                        <Link to="/register" className="btn btn-outline-light btn-lg mx-2" style={{ borderRadius: "20px" }}>Registrarse</Link>
                    </div>
                </div>

                <img src={example} ></img>

                {/* Feature Highlights Section */}
                <section className="mt-5">
                    <h2 className="mb-4" style={{ color: "#ffffff" }}>¿Por qué elegir PulseSurvey?</h2>
                    <div className="row">
                        {[{ title: "Fácil de usar", desc: "Crea encuestas en minutos con nuestra interfaz intuitiva." },
                          { title: "Resultados rápidos", desc: "Accede a tus resultados en tiempo real." },
                          { title: "Colabora fácilmente", desc: "Comparte encuestas y analiza respuestas con tu equipo." }].map((feature, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card shadow-sm border-0" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{feature.title}</h5>
                                        <p className="card-text">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="mt-5 text-center" style={{ color: "#ffffff" }}>
                    <p>&copy; {new Date().getFullYear()} PulseSurvey. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};
