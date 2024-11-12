import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";

export const SurveyResults = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Solo realiza la llamada si no se tiene ya la encuesta correcta en el store
        if (!store.survey || store.survey.id !== parseInt(id)) {
            actions.getSurvey(id);
        }
    }, [id]);

    // Validar el formulario solo si la encuesta se ha cargado correctamente
    useEffect(() => {
        if (store.survey && store.survey.id) {
            validateForm();
        }
    }, [store.survey]);

    const validateForm = () => {
        if (!store.survey || !store.survey.questions) {
            setIsFormValid(false);
            return;
        }

        const allQuestionsAnswered = store.survey.questions.every((question) => {
            if (question.question_type === "open_ended") {
                const textarea = document.getElementById(`question-${question.id}`);
                return textarea && textarea.value.trim() !== "";
            } else {
                const options = document.getElementsByName(`question-${question.id}`);
                return Array.from(options).some((option) => option.checked);
            }
        });

        setIsFormValid(allQuestionsAnswered);
    };

    const handleBack = () => {
        navigate("/user_logued");
    };

    const handleSubmit = () => {
        alert("Thank you for your responses!");
        navigate("/user_logued");
    };

    // Verificar si la encuesta está disponible
    if (!store.survey || store.survey.id !== parseInt(id)) {
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
                    <div key={question.id} className="question-container question-board">
                        <h4 className="question-text">{index + 1}. {question.question_text}</h4>
                        <div className="options-container">
                            {question.question_type === "open_ended" ? (
                                <textarea
                                    id={`question-${question.id}`}
                                    className="open-ended-response"
                                    placeholder="Type your answer here..."
                                    onChange={validateForm}
                                ></textarea>
                            ) : (
                                question.options && question.options.map((option) => (
                                    <div key={option.id} className="option">
                                        <input
                                            type={question.question_type === "multiple_choice" ? "checkbox" : "radio"}
                                            id={`option-${option.id}`}
                                            name={`question-${question.id}`}
                                            value={option.id}
                                            onChange={validateForm}
                                        />
                                        <label htmlFor={`option-${option.id}`}>{option.option_text}</label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="btn submit-btn"
                onClick={handleSubmit}
                disabled={!isFormValid}
                style={{ backgroundColor: isFormValid ? '#DB6FEB' : '#e0e0e0', cursor: isFormValid ? 'pointer' : 'not-allowed' }}
            >
                Submit my responses
            </button>
        </div>
    );
};
