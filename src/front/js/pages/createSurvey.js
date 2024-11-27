import React, { useState, useEffect, useContext } from "react";
import "../../styles/createSurvey.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";

export const CreateSurvey = () => {
    const { store, actions } = useContext(Context);
    const [user, setUser] = useState(store.user);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("questions"); // Controla la pestaña activa

    const [surveyData, setSurveyData] = useState({
        creator_id: user?.id || "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        is_public: true,
        status: "draft",
        type: "survey",
        questions: []
    });
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: "",
        question_type: "multiple_choice",
        required: true,
        options: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isAuthenticated) {
            alert("User not logged in");
            navigate("/login");
        } else if (!store.user) {
            actions.getUserProfile().then(() => {
                setUser(store.user);
            });
        } else {
            setUser(store.user);
            setSurveyData((prevSurveyData) => ({
                ...prevSurveyData,
                creator_id: store.user?.id || ""
            }));
        }


    }, [store.isAuthenticated, store.user, navigate, actions]);

    useEffect(() => {
        if (showSettingsModal || showReviewModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [showSettingsModal, showReviewModal]);

    const handleSurveyChange = (e) => {
        const { name, value } = e.target;
        setSurveyData({ ...surveyData, [name]: value });
    };

    const handleAddQuestion = () => {
        if (currentQuestion.question_text.trim() !== "") {
            setSurveyData({
                ...surveyData,
                questions: [...surveyData.questions, { ...currentQuestion, order: surveyData.questions.length + 1 }]
            });
            setCurrentQuestion({ question_text: "", question_type: "multiple_choice", required: true, options: [] });
        } else {
            alert("Please enter a valid question text.");
        }
    };

    const handleAddOption = (optionText) => {
        if (optionText.trim() !== "") {
            setCurrentQuestion({
                ...currentQuestion,
                options: [...currentQuestion.options, { option_text: optionText, order: currentQuestion.options.length + 1 }]
            });
        }
    };

    const handleDeleteOption = (index) => {
        setCurrentQuestion(prevQuestion => ({
            ...prevQuestion,
            options: prevQuestion.options.filter((_, i) => i !== index)
        }));
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("jwt-token")}`);

        const updatedSurveyData = {
            ...surveyData,
            creator_id: user?.id,
            questions: surveyData.questions.map((q, index) => ({
                ...q,
                order: index + 1,
                options: q.options.map((opt, optIndex) => ({
                    ...opt,
                    order: optIndex + 1
                }))
            }))
        };

        const raw = JSON.stringify(updatedSurveyData);

        console.log("Submitting survey data:", updatedSurveyData);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/surveys/full", requestOptions);
            const data = await response.json();

            if (response.ok) {
                if (data.survey && data.survey.survey_id) {
                    navigate(`/surveyS/${data.survey.survey_id}`);
                } else {
                    console.error("Survey ID is missing in the response.");
                    alert("Survey was created, but the Survey ID is missing in the response.");
                }
            } else {
                console.error("Error:", data.message || "An unexpected error occurred.");
                alert(`Error: ${data.message || "An unexpected error occurred."}`);
            }
        } catch (error) {
            console.error("Error sending data:", error);
            alert("An error occurred while sending the data. Please check the server logs for more details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-survey-container">
            <div className="container-box">
                <div className="create-survey-header">
                    <h1 className="create-survey-title">Create your survey</h1>
                    <ul className="nav nav-underline create-tabs">
                        <li className="nav-item">
                            <a
                                className={`nav-link title-tabs ${activeTab === "questions" ? "active" : ""}`}
                                href="#"
                                onClick={() => setActiveTab("questions")}

                            >
                                Questions
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link title-tabs ${activeTab === "settings" ? "active" : ""}`}
                                href="#"
                                onClick={() => {
                                    setActiveTab("settings");
                                    setShowSettingsModal(true); // Mostrar el modal
                                }}
                            >
                                Settings
                            </a>
                        </li>
                    </ul>
                </div>
                {/* Modal de Settings */}
                {showSettingsModal && <div className="modal-backdrop fade show"></div>}
                <div
                    className={`modal fade ${showSettingsModal ? 'show d-block' : ''}`}
                    tabIndex="-1"
                    style={{ display: showSettingsModal ? 'block' : 'none' }}
                    role="dialog"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowSettingsModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="modal-settings">
                                        <label className="form-label-public-surv">Public Survey</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="flexSwitchCheckDefault"
                                                checked={surveyData.is_public === true}
                                                onChange={() => setSurveyData({ ...surveyData, is_public: !surveyData.is_public })}
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                {surveyData.is_public ? 'Yes' : 'No'}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control create-survey-input"
                                            name="start_date"
                                            value={surveyData.start_date}
                                            onChange={handleSurveyChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control create-survey-input"
                                            name="end_date"
                                            value={surveyData.end_date}
                                            onChange={handleSurveyChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Survey Status</label>
                                        <select
                                            className="form-select create-survey-input"
                                            name="status"
                                            value={surveyData.status}
                                            onChange={handleSurveyChange}
                                            required
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => {
                                        setShowSettingsModal(false);  // Cierra la modal
                                        setActiveTab("questions");    // Cambia automáticamente a la pestaña "Questions"
                                    }}
                                ></button>
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    setSurveyData({ ...surveyData }); // Guarda los cambios localmente
                                    setShowSettingsModal(false);
                                    setActiveTab("questions");
                                    alert("Settings saved successfully!");
                                }}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card create-survey-card">
                    <form>
                        <div className="title-des-create">
                            <input
                                type="text"
                                placeholder="Write the tittle here"
                                className="form-control create-survey-input-tit no-border"
                                name="title"
                                value={surveyData.title}
                                onChange={handleSurveyChange}
                                required
                            />
                            <textarea
                                className="form-control create-survey-input-desc no-border"
                                placeholder="Description of the survey"
                                name="description"
                                value={surveyData.description}
                                onChange={handleSurveyChange}
                                required
                            ></textarea>
                        </div>
                    </form>
                </div>



                <div className="container-question-box">
                    <div className="question-inputs">
                        <input
                            type="text"
                            placeholder="Question title"
                            className="form-control create-survey-input-qt"
                            value={currentQuestion.question_text}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                            required
                        />

                        <select
                            className="form-select create-survey-input-q"
                            value={currentQuestion.question_type}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_type: e.target.value })}
                            required
                        >
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="open_ended">Open-ended</option>
                            <option value="yes_no">Yes/No</option>
                        </select>
                    </div>

                    <div className="option-create-survey">
                        <div className="option-create-survey-enter">
                            <input
                                type="text"
                                className="form-control create-survey-input-option"
                                placeholder="Write your option here"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                                        handleAddOption(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                                disabled={currentQuestion.question_type !== "multiple_choice"}
                            />
                            <ul className="option-list-create">
                                {currentQuestion.options.map((option, index) => (
                                    <li key={index} className="option-item">
                                        <input
                                            type="text"
                                            className="form-control create-survey-input-option-item"
                                            value={option.option_text}
                                            readOnly
                                        />
                                        <button
                                            className="delete-option-btn"
                                            onClick={() => handleDeleteOption(index)}
                                        >
                                            <i><FaRegTrashAlt /></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="add-option-btn ml-auto"
                                onClick={handleAddQuestion}
                            >
                                Add another question
                            </button>
                        </div>
                    </div>

                    {/* Modal de Review */}
                    {showReviewModal && <div className="modal-backdrop fade show"></div>}
                    <div
                        className={`modal fade ${showReviewModal ? "show d-block" : ""}`}
                        style={{ display: showReviewModal ? "block" : "none" }}
                    >
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Review and Submit</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowReviewModal(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <strong>Title: </strong>{surveyData.title}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Description: </strong>{surveyData.description}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Start Date: </strong>{surveyData.start_date}
                                    </div>
                                    <div className="mb-3">
                                        <strong>End Date: </strong>{surveyData.end_date}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Status: </strong>{surveyData.status}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Public: </strong>{surveyData.is_public ? "Yes" : "No"}
                                    </div>
                                    <div className="mb-3">
                                        <h5>Questions:</h5>
                                        <ul>
                                            {surveyData.questions.map((q, index) => (
                                                <li key={index}>
                                                    <strong>Question {index + 1}: </strong>
                                                    {q.question_text}
                                                    {q.question_type === "multiple_choice" && (
                                                        <ul>
                                                            {q.options.map((option, optionIndex) => (
                                                                <li key={optionIndex}>{option.option_text}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowReviewModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={handleFinalSubmit}
                                        disabled={isSubmitting}>
                                        Submit Survey
                                        {isSubmitting ? "Submitting..." : "Submit Survey"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="final-buttons">
                <button
                    type="button"
                    className="review-surv-btn"
                    onClick={() => setShowReviewModal(true)}
                >

                    Review and submit
                </button>
            </div>
        </div>
    );
};

