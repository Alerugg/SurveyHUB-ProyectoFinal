import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pendingSurveyView.css"; // Asegúrate de usar la ruta correcta

const PendingSurveyView = ({ survey }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!survey || survey.status !== "draft" || !survey.start_date) return;

        const startTime = new Date(survey.start_date).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const timeDifference = startTime - now;

            if (timeDifference <= 0) {
                setTimeLeft(null);
            } else {
                setTimeLeft(timeDifference);
            }
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, [survey]);

    const formatTime = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        return `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`;
    };

    if (!survey) {
        return <div className="loading">Loading survey data...</div>;
    }

    return (
        <div className="pending-survey-container">
            <h2 className="survey-title">{survey.title}</h2>
            <p className="survey-description">{survey.description}</p>
            {timeLeft !== null ? (
                <div className="countdown-container">
                    <p>Time left to start the survey:</p>
                    <p className="countdown-timer">{formatTime(timeLeft)}</p>
                </div>
            ) : (
                <p className="status-message">The survey is now active!</p>
            )}
            <button className="back-button" onClick={() => navigate("/user_logued")}>
                ← Back to explore surveys
            </button>
        </div>
    );
};

export default PendingSurveyView;
