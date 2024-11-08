import React, { useContext } from "react";
import "../../styles/login.css";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import login from '/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/login.png';


export const Login = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-form-container">
                    <h1 className="login-title">E<span className="highlight">Login</span></h1>
                    <form>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control login-input"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control login-input"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="form-group d-flex justify-content-between">
                            <button type="submit" className="btn login-btn">Log in</button>
                            <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
                        </div>
                    </form>
                    <div className="signup-prompt">
                        Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
                    </div>
                </div>
                <div className="login-image" style={{ backgroundImage: `url(${login})` }}></div>

            </div>
        </div>
    );
};
