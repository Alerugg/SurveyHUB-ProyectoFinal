import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/surveys.css";
import { Context } from "../store/appContext";

export const SurveyCard = ({ survey, onClick }) => {
    return (
        <div className="survey-card" onClick={onClick}>
            <div className="survey-card-header">
                <img src="https://placehold.co/600x400" alt="Survey" className="survey-image" />
                <div className={`survey-status ${survey.is_public ? 'public' : 'private'}`}>{survey.is_public ? 'Public' : 'Private'}</div>
            </div>
            <div className="survey-card-body">
                <h3 className="survey-card-title">{survey.title}</h3>
                <p className="survey-card-description">{survey.description}</p>
                <div className="survey-status-badge">
                    <span className={`status-badge ${survey.status.toLowerCase()}`}>{survey.status === 'draft' ? 'Pending' : survey.status}</span>
                </div>
                <div className="survey-card-footer">
                    <p className="survey-card-dates">
                        {survey.end_date && !isNaN(new Date(survey.end_date).getTime())
                            ? `Available until: ${new Date(survey.end_date).toLocaleString()}`
                            : "Available indefinitely"}
                    </p>
                    <div className="survey-goal">
                        Responses goal: <span>{survey.currentResponses}/{survey.totalResponses}</span>
                    </div>
                    <div className="survey-creator">
                        <img src="https://placehold.co/50x50" alt="Creator" className="creator-avatar" />
                        <span>by {survey.creatorName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
