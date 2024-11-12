import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";

export const SurveyResults = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                await actions.getSurvey(id);
            } catch (err) {
                console.error("Error loading survey data", err);
            }
        };
        fetchSurvey();
    }, [id, actions]);

    const handleBack = () => {
        navigate("/user_logued");
    };

    const handleSubmit = () => {
        alert("Thank you for your responses!");
        navigate("/user_logued");
    };

    if (!store.survey) {
        return <div className="loading">Loading survey details...</div>;
    }

    const survey = store.survey;

    return (
        <div className="survey-results-container">
            <div className="survey-header">
                <button className="back-button" onClick={handleBack}>← Back to explore surveys</button>
                <h2 className="survey-title">{survey.title}</h2>
                <img src={"https://placehold.co/1800x400"} alt="Survey" className="survey-image" />
                <p className="survey-description">{survey.description}</p>
            </div>
            <div className="survey-questions">
                {survey.questions && survey.questions.map((question, index) => (
                    <div key={question.id} className="question-container">
                        <h4 className="question-text">{index + 1}. {question.question_text}</h4>
                        <div className="options-container">
                            {question.question_type === "open_ended" ? (
                                <textarea className="open-ended-response" placeholder="Type your answer here..."></textarea>
                            ) : (
                                question.options.map((option) => (
                                    <div key={option.id} className="option">
                                        <input
                                            type={question.question_type === "multiple_choice" ? "checkbox" : "radio"}
                                            id={`option-${option.id}`}
                                            name={`question-${question.id}`}
                                            value={option.id}
                                        />
                                        <label htmlFor={`option-${option.id}`}>{option.option_text}</label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn submit-btn" onClick={handleSubmit}>Submit my responses</button>
        </div>
    );
};
