import React, { useState } from "react";
import "../../styles/forgotPassword.css";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch("https://didactic-space-tribble-vx74pxvwv9rcpxrp-3001.app.github.dev/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error("Unable to process request. Please check the email address and try again.");
            }

            setMessage("If the email is registered, you will receive password reset instructions.");
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form-container">
                <h1 className="forgot-password-title">
                    <span className="highlight-e">E</span>
                    <span className="highlight-vote">vote</span>
                </h1>
                <h2 className="forgot-password-subtitle">Forgot Your Password?</h2>
                <p className="forgot-password-description">Please enter your email address below to receive instructions on how to reset your password.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-placeholder">
                        <input
                            type="email"
                            className="form-control email-input"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn forgot-password-btn">Send Reset Instructions</button>
                </form>
                {message && <div className="message">{message}</div>}
                <button className="btn back-btn" onClick={() => navigate("/login")}>Back to Login</button>
            </div>
        </div>
    );
};
