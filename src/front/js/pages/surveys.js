import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/surveys.css";
import { Context } from "../store/appContext";

export const AvailableSurveys = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getSurveys();
    }, []);

    const handleSurveyClick = (id) => {
        navigate(`/surveys/${id}`);  // Navegar a la ruta de SurveyResults con el ID correcto
    };

    if (!store.surveys || store.surveys.length === 0) {
        return <div className="loading">Loading available surveys...</div>;
    }

    return (
        <div className="available-surveys-container">
            <h2 className="available-surveys-title">Available Surveys</h2>
            <div className="surveys-list">
                {store.surveys.map((survey) => (
                    <div key={survey.id} className="survey-card" onClick={() => handleSurveyClick(survey.id)}>
                        <h3 className="survey-card-title">{survey.title}</h3>
                        <p className="survey-card-description">{survey.description}</p>
                        <p className="survey-card-dates">Available until: {new Date(survey.end_date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
