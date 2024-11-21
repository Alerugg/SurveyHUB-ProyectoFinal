import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";
import PendingSurveyView from "../component/pendingSurveyView";
import { ClosedSurveyView } from "../component/closedSurveyView";  // Importa el componente ClosedSurveyView
import moment from "moment";

export const SurveyResults = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);
    const [responses, setResponses] = useState({});
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        // Obtener la encuesta si aún no se ha cargado
        if (!store.survey || store.survey.id !== parseInt(id)) {
            actions.getSurvey(id);
        }
    }, [id, store.survey, actions]);

    useEffect(() => {
        // Obtener el perfil del usuario y verificar si ha votado en la encuesta
        if (store.isAuthenticated) {
            actions.getUserProfile().then(() => {
                if (store.user) {
                    actions.getUserVotedSurveys(store.user.id).then(() => {
                        const hasVotedInSurvey = store.userVotedSurveys.some(survey => survey.id === parseInt(id));
                        setHasVoted(hasVotedInSurvey);
                    });
                }
            });
        }
    }, [store.isAuthenticated, actions, id]);

    useEffect(() => {
        // Actualizar el estado de la encuesta según las fechas al abrir la encuesta
        if (store.survey) {
            const currentDate = moment();
            const startDate = moment(store.survey.start_date);
            const endDate = moment(store.survey.end_date);

            let newStatus = store.survey.status;

            if (currentDate.isBefore(startDate)) {
                newStatus = "draft";
            } else if (currentDate.isBetween(startDate, endDate, undefined, "[]")) {
                newStatus = "active";
            } else if (currentDate.isAfter(endDate)) {
                newStatus = "closed";
            }

            if (newStatus !== store.survey.status) {
                actions.updateSurveyStatus(id, newStatus);
            }
        }
    }, [store.survey, actions, id]);

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
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                alert("Para votar debe hacer login");
                return;
            }
            
            // Construye los datos de votos usando el estado responses
            const votesData = Object.entries(responses).map(([questionId, optionId]) => ({
                option_id: parseInt(optionId),
            }));

            // Envía cada voto al backend usando un bucle
            for (let vote of votesData) {
                const response = await fetch(process.env.BACKEND_URL + "/api/votes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(vote),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Response error:", errorText);
                    throw new Error("Failed to submit vote for option " + vote.option_id);
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
                                        disabled={!store.isAuthenticated || hasVoted}
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
                                                disabled={!store.isAuthenticated || hasVoted}
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
                    disabled={!isFormValid || !store.isAuthenticated || hasVoted}
                    style={{ backgroundColor: isFormValid && store.isAuthenticated && !hasVoted ? '#DB6FEB' : '#e0e0e0', cursor: isFormValid && store.isAuthenticated && !hasVoted ? 'pointer' : 'not-allowed' }}
                >
                    {hasVoted ? "Ya has votado en esta encuesta" : "Submit my responses"}
                </button>
                {!store.isAuthenticated && (
                    <div className="alert-message">Para votar debe hacer login.</div>
                )}
                {hasVoted && (
                    <div className="alert-message">Ya has votado en esta encuesta.</div>
                )}
            </div>
        );
    } else if (survey.status === "closed") {
        // Renderiza el componente ClosedSurveyView con la encuesta cerrada
        return <ClosedSurveyView survey={survey} />;
    } else if (survey.status === "draft") {
        return <PendingSurveyView survey={survey} />;
    }

    return null;
};
