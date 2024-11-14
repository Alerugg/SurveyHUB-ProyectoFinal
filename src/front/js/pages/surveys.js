import React, { useEffect , useContext } from "react";
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
        navigate(`/surveys/${id}`);
    };

    if (!store.surveys || store.surveys.length === 0) {
        return <div className="available-surveys-loading">Loading available surveys...</div>;
    }

    return (
        <div className="available-surveys-container">
            <h2 className="available-surveys-title">Available Surveys</h2>
            <div className="available-surveys-list">
                {store.surveys.map((survey) => (
                    <div key={survey.id} className="available-survey-card" onClick={() => handleSurveyClick(survey.id)}>
                        <div className="available-survey-card-header">
                            <img src="https://placehold.co/600x400" alt="Survey" className="available-survey-image" />
                            <div className={`available-survey-status ${survey.is_public ? 'public' : 'private'}`}>
                                {survey.is_public ? 'Public' : 'Private'}
                            </div>
                        </div>
                        <div className="available-survey-card-body">
                            <h3 className="available-survey-card-title">{survey.title}</h3>
                            <p className="available-survey-card-description">{survey.description}</p>
                            <div className="available-survey-status-badge">
                                <span className={`available-status-badge ${survey.status.toLowerCase()}`}>{survey.status}</span>
                            </div>
                            <div className="available-survey-card-footer">
                                <p className="available-survey-card-dates">
                                    Available until: {new Date(survey.end_date).toLocaleDateString()}
                                </p>
                                <div className="available-survey-goal">
                                    Responses goal: <span>{survey.currentResponses}/{survey.totalResponses}</span>
                                </div>
                                <div className="available-survey-creator">
                                    <img src="https://placehold.co/600x400" alt="Creator" className="available-survey-creator-avatar" />
                                    <span>by {survey.creatorName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
