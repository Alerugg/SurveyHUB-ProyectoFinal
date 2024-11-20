import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";
import ClosedSurveyResults from "../component/closedSurveyView";
import PendingSurveyView from "../component/pendingSurveyView";
import ReactECharts from 'echarts-for-react';

export const SurveyResults = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);
    const [responses, setResponses] = useState({});
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        // Solo realiza la llamada si no se tiene ya la encuesta correcta en el store
        if (!store.survey || store.survey.id !== parseInt(id)) {
            actions.getSurvey(id);
        }
    }, [id]);

    useEffect(() => {
        // Validar si el usuario ya ha votado en esta encuesta
        const token = localStorage.getItem("jwt-token");
        if (token) {
            checkIfUserHasVoted();
        }
    }, [store.survey]);

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

    const checkIfUserHasVoted = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) return;

            const response = await fetch(`${process.env.BACKEND_URL}/api/surveys/${id}/has_voted`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setHasVoted(result.has_voted);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error checking if user has voted: ", error);
        }
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
                // survey_id: parseInt(id), // `id` es el ID de la encuesta obtenido de los parámetros de la URL
                // question_id: parseInt(questionId),
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
        // Renderizar análisis estadístico usando un dashboard moderno
        const barOptions = {
            xAxis: {
                type: 'category',
                data: survey.questions.map((q) => q.question_text),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: survey.questions.map((q) => q.options.reduce((acc, opt) => acc + (opt.votes ? opt.votes.length : 0), 0)),
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)',
                    },
                },
            ],
        };

        const pieOptions = survey.questions.map((question) => ({
            title: {
                text: `Responses for: ${question.question_text}`,
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    name: 'Responses',
                    type: 'pie',
                    radius: '50%',
                    data: question.options.map((opt) => ({
                        value: opt.votes ? opt.votes.length : 0,
                        name: opt.option_text,
                    })) || [],
                },
            ],
        }));

        const lineOptions = {
            xAxis: {
                type: 'category',
                data: survey.questions.map((q) => q.question_text),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: survey.questions.map((q) => q.options.reduce((acc, opt) => acc + (opt.votes ? opt.votes.length : 0), 0)),
                    type: 'line',
                    smooth: true,
                },
            ],
        };

        return (
            <div className="survey-results-container">
                <div className="survey-header">
                    <button className="back-button" onClick={handleBack}>← Back to explore surveys</button>
                    <h2 className="survey-title">{survey.title}</h2>
                    <p className="survey-description">{survey.description}</p>
                </div>
                <div className="dashboard-container">
                    <div className="chart-card">
                        <h3 className="chart-title">Bar Chart Analysis</h3>
                        <ReactECharts option={barOptions} />
                    </div>
                    {pieOptions.map((options, index) => (
                        <div key={index} className="chart-card">
                            <h3 className="chart-title">Pie Chart Analysis</h3>
                            <ReactECharts option={options} />
                        </div>
                    ))}
                    <div className="chart-card">
                        <h3 className="chart-title">Line Chart Analysis</h3>
                        <ReactECharts option={lineOptions} />
                    </div>
                </div>
            </div>
        );
    } else if (survey.status === "draft") {
        return <PendingSurveyView survey={survey} />;
    }

    return null;
};
