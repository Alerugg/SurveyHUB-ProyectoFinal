import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";
import PendingSurveyView from "../component/pendingSurveyView";
import { ClosedSurveyView } from "../component/closedSurveyView";
import moment from "moment";

export const SurveyResults = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);
    const [responses, setResponses] = useState({});
    const [hasVoted, setHasVoted] = useState(false);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    // Fetch survey data and check if the user has voted
    useEffect(() => {
        const fetchSurveyData = async () => {
            if (!store.survey || store.survey.id !== parseInt(id)) {
                await actions.getSurvey(id);
            }

            if (store.isAuthenticated && store.user) {
                const votedSurveys = await actions.getUserVotedSurveys(store.user.id);
                if (votedSurveys) {
                    const voted = votedSurveys.some((survey) => survey.id === parseInt(id));
                    setHasVoted(voted);

                    // Mostrar modal si ya votó
                    if (voted) {
                        setShowModal(true);
                    }
                }
            }
        };

        fetchSurveyData();
    }, [id, store.survey?.id, store.isAuthenticated, store.user?.id, actions]);

    // Update survey status based on the current date
    useEffect(() => {
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

    // Validate form before submission
    useEffect(() => {
        if (store.survey && store.survey.questions) {
            validateForm();
        }
    }, [store.survey, responses]);

    const validateForm = () => {
        if (!store.survey || !store.survey.questions) {
            setIsFormValid(false);
            return;
        }

        const allQuestionsAnswered = store.survey.questions.every((question) => {
            if (question.question_type === "open_ended") {
                return responses[question.id] && responses[question.id].trim() !== "";
            } else {
                return responses[question.id] !== undefined;
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
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            alert("Please ensure all questions are answered before submitting.");
            return;
        }

        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                alert("Para votar debe hacer login");
                return;
            }

            const votesData = Object.entries(responses).map(([questionId, optionId]) => ({
                option_id: parseInt(optionId),
            }));

            for (let vote of votesData) {
                const response = await fetch(`${process.env.BACKEND_URL}/api/votes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(vote),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Response error:", errorText);
                    throw new Error(`Failed to submit vote for option ${vote.option_id}`);
                }
            }

            alert("Thank you for your responses!");
            navigate("/user_logued");
        } catch (error) {
            console.error("Error submitting responses:", error);
            alert("Failed to submit your responses. Please try again.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Render conditional UI
    if (!store.survey || !store.survey.questions) {
        return <div className="loading">Loading survey details...</div>;
    }

    const survey = store.survey;

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
                    {survey.questions.map((question, index) => (
                        <div key={question.id} className="question-container question-board">
                            <h4 className="question-text">{index + 1}. {question.question_text}</h4>
                            <div className="options-container">
                                {question.question_type === "open_ended" ? (
                                    <textarea
                                        className="open-ended-response"
                                        placeholder="Type your answer here..."
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                                        disabled={!store.isAuthenticated || hasVoted}
                                    ></textarea>
                                ) : (
                                    question.options.map((option) => (
                                        <div key={option.id} className="option">
                                            <input
                                                type={question.question_type === "multiple_choice" ? "checkbox" : "radio"}
                                                name={`question-${question.id}`}
                                                value={option.id}
                                                onChange={() => handleInputChange(question.id, option.id)}
                                                disabled={!store.isAuthenticated || hasVoted}
                                            />
                                            <label>{option.option_text}</label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className={`btn submit-btn ${isFormValid && store.isAuthenticated && !hasVoted ? 'enabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={!isFormValid || !store.isAuthenticated || hasVoted}>
                    {hasVoted ? "Ya has votado en esta encuesta" : "Submit my responses"}
                </button>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>¡Ya has votado en esta encuesta!</h2>
                            <button onClick={closeModal}>Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
        );
    } else if (survey.status === "closed") {
        return <ClosedSurveyView survey={survey} />;
    } else if (survey.status === "draft") {
        return <PendingSurveyView survey={survey} />;
    }

    return null;
};
