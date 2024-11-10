import React, { useContext } from "react";
import "../../styles/login.css";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import login from '/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/login.png';


export const Login = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="login-container">
            <img src={login} alt="Login" className="login-image-small" />

            <div className="login-form-container">
                <h1 className="login-title">
                    <span className="highlight-e">E</span>
                    <span className="highlight-vote">vote</span>
                </h1>
                <form>
                    <div className="form-group-placeholder">
                        <input
                            type="email"
                            className="form-control email-input"
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            className="form-control password-input"
                            placeholder="Password"
                            required
                        />

                    </div>
                    <div className="form-group d-flex justify-content-between">
                        <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
                    </div>
                    <button type="submit" className="btn login-btn">Log in</button>
                </form>
                <div className="signup-prompt">
                    Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
                </div>
            </div>
            <div className="login-image" style={{ backgroundImage: 'url(${login}) '}}></div>

        </div>

    );
};
