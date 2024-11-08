import React, { useContext } from "react";
import "../../styles/login.css";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Login = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="login-container">
            <div className="container mt-5">
                <div className="login-content">
                    <div className="card shadow-sm border-0 p-4 login-card">
                        <h1 className="display-4 fw-bold text-center">Welcome Back!</h1>
                        <p className="lead text-center">Login to access your account and continue your journey with PulseSurvey.</p>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control login-input" id="email" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control login-input" id="password" required />
                            </div>
                            <button type="submit" className="btn btn-lg login-btn w-100">Login</button>
                        </form>
                        <div className="mt-4 text-center">
                            <p>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></p>
                        </div>
                    </div>
                    <div className="login-image" style={{ backgroundImage: "url('https://placehold.co/800x600')" }}></div>
                </div>
            </div>
        </div>
    );
};
