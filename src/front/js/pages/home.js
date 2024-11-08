import React from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import example from "/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/roadmapexample.png";

export const Home = () => {
    return (
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", minHeight: "100vh" }}>
            {/* Header Section */}
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#3F374D", color: "#ffffff", borderRadius: "20px" }}>
                    <h1 className="display-4 fw-bold">Welcome to PulseSurvey</h1>
                    <p className="lead">Discover how our surveys can help you gather valuable insights and make better decisions.</p>
                    <div className="mt-4">
                        <Link to="/login" className="btn btn-primary btn-lg mx-2" style={{ backgroundColor: "#DB6FEB", color: "#ffffff", border: "none", borderRadius: "20px", transition: "none" }} onMouseOver={(e) => { e.target.style.transform = "scale(1.05)" }} onMouseOut={(e) => { e.target.style.transform = "scale(1)" }}>Login</Link>
                        <Link to="/register" className="btn btn-primary btn-lg mx-2" style={{ backgroundColor: "#DB6FEB", color: "#ffffff", border: "none", borderRadius: "20px", transition: "none" }} onMouseOver={(e) => { e.target.style.transform = "scale(1.05)" }} onMouseOut={(e) => { e.target.style.transform = "scale(1)" }}>Sign Up</Link>
                    </div>
                </div>

                {/* Feature Highlights Section */}
                <section className="mt-5">
                    <h2 className="mb-4" style={{ color: "#333333" }}>Why Choose PulseSurvey?</h2>
                    <div className="row">
                        {[{ title: "Easy to Use", desc: "Create surveys in minutes with our intuitive interface." },
                          { title: "Quick Results", desc: "Access your results in real-time." },
                          { title: "Collaborate Easily", desc: "Share surveys and analyze responses with your team." }].map((feature, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card shadow-sm border-0" style={{ backgroundColor: "#ffffff", color: "#333333", borderRadius: "20px" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{feature.title}</h5>
                                        <p className="card-text">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Example Roadmap Section */}
                <section className="mt-5">
                    <h2 className="mb-4" style={{ color: "#333333" }}>See How It Works</h2>
                    <div className="text-center">
                        <img src={example} alt="Example Roadmap" className="img-fluid" style={{ borderRadius: "20px", maxHeight: "400px" }} />
                    </div>
                </section>

                {/* Hot Public Surveys Section */}
                <section className="mt-5">
                    <h2 className="mb-4" style={{ color: "#333333" }}>Hot Public Surveys</h2>
                    <div className="row">
                        {[1, 2, 3, 4].map((survey, index) => (
                            <div key={index} className="col-md-3 mb-4">
                                <div className="card shadow-sm border-0" style={{ backgroundColor: "#ffffff", color: "#333333", borderRadius: "20px" }}>
                                    <img src="https://placehold.co/600x400" className="card-img-top" alt="Hot Survey" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} />
                                    <div className="card-body">
                                        <h5 className="card-title">Hot Survey {index + 1}</h5>
                                        <p className="card-text">A brief description...</p>
                                        <Link to={`/survey/${index}`} className="btn btn-primary btn-sm" style={{ backgroundColor: "#DB6FEB", color: "#ffffff", border: "none", borderRadius: "10px", transition: "none" }} onMouseOver={(e) => { e.target.style.transform = "scale(1.05)" }} onMouseOut={(e) => { e.target.style.transform = "scale(1)" }}>Participate now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};