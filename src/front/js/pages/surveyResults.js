import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";
import ClosedSurveyResults from "../component/closedSurveyView";
import PendingSurveyView from "../component/pendingSurveyView";

export const SurveyResults = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);
    const [responses, setResponses] = useState({});

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

    const handleInputChange = (questionId, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [questionId]: value,
        }));
        validateForm();
    };

    const handleSubmit = async () => {
        try {
            const userId = store.currentUser?.id || 1; // Usar 1 como un valor por defecto temporalmente

            // Construye los datos de votos usando el estado responses
            const votesData = Object.entries(responses).map(([questionId, optionId]) => ({
                user_id: userId,
                survey_id: parseInt(id), // `id` es el ID de la encuesta obtenido de los parámetros de la URL
                question_id: parseInt(questionId),
                option_id: parseInt(optionId),
            }));

            // Envía cada voto al backend usando un bucle
            for (let vote of votesData) {
                const response = await fetch("https://didactic-space-tribble-vx74pxvwv9rcpxrp-3001.app.github.dev/api/votes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(vote),
                });

                if (!response.ok) {
                    throw new Error("Failed to submit vote for question " + vote.question_id);
                }
            }

            // Si todos los votos se envían exitosamente
            alert("Thank you for your responses!");
            navigate("/user_logued");
        } catch (error) {
            console.error("Error submitting responses:", error);
            alert("Failed to submit your responses. Please try again.");
        }
    };

    // Verificar si la encuesta está disponible
    if (!store.survey || store.survey.id !== parseInt(id)) {
        return <div className="loading">Loading survey details...</div>;
    }

    const survey = store.survey;

    // Renderizado condicional basado en el estado de la encuesta
    if (survey.status === "active") {
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
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                                    ></textarea>
                                ) : (
                                    question.options && question.options.map((option) => (
                                        <div key={option.id} className="option">
                                            <input
                                                type={question.question_type === "multiple_choice" ? "checkbox" : "radio"}
                                                id={`option-${option.id}`}
                                                name={`question-${question.id}`}
                                                value={option.id}
                                                onChange={() => handleInputChange(question.id, option.id)}
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
    } else if (survey.status === "closed") {
        return <ClosedSurveyResults survey={survey} />;
    } else if (survey.status === "draft") {
        return <PendingSurveyView survey={survey} />;
    }

    return null;
};
