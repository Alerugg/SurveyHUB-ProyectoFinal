import React, { useState, useEffect } from "react";
import "../../styles/createSurvey.css";
import { useNavigate } from "react-router-dom";

export const CreateSurvey = () => {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [status, setStatus] = useState("draft");
    const [creatorId, setCreatorId] = useState("");  // Campo para el id del usuario
    const [creatorName, setCreatorName] = useState("");  // Campo para el nombre del usuario
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("multiple_choice");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState([""]);

    const navigate = useNavigate();

    useEffect(() => {
        // Simular la obtención del usuario logueado
        const loggedUser = JSON.parse(localStorage.getItem("user")); // Asumimos que el usuario está guardado en el localStorage
        if (loggedUser) {
            setCreatorId(loggedUser.id);  // Asignar el id del usuario
            setCreatorName(loggedUser.name);  // Asignar el nombre del usuario
        } else {
            alert("User not logged in");
        }
    }, []);

    const nextStep = () => setStep((prev) => prev + 1);
    const previousStep = () => setStep((prev) => prev - 1);

    const handleSubmitSurvey = async () => {
        if (title && description && startDate && endDate && questions.length > 0 && creatorId) {
            const surveyData = {
                creator_id: creatorId,  // Enviar el id del creador
                title,
                description,
                start_date: startDate,
                end_date: endDate,
                is_public: isPublic,
                status,
                type: "survey", // Tipo fijo "survey"
                questions,
            };

            try {
                const response = await fetch('https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3001.app.github.dev/surveys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(surveyData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Survey data sent successfully:", data);
                    alert("Survey created successfully.");
                    navigate("/surveys");
                } else {
                    console.error("Error:", data);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Error sending data:", error);
                alert("An error occurred while sending the data.");
            }
        } else {
            alert("Complete all fields and add at least one question before submitting.");
        }
    };

    return (
        <div className="create-survey-container">
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4 header-section">
                    <h2 className="display-5 fw-bold">Create a New Survey</h2>
                </div>

                {/* Pantalla 1: Información básica */}
                {step === 1 && (
                    <div className="card shadow-sm border-0 mb-4 create-survey-card">
                        <form>
                            <h4>Basic Information</h4>
                            <div className="mb-3">
                                <label className="form-label">Survey Title</label>
                                <input
                                    type="text"
                                    className="form-control create-survey-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control create-survey-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control create-survey-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control create-survey-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Survey Status</label>
                                <select
                                    className="form-select create-survey-input"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Creator</label>
                                <input
                                    type="text"
                                    className="form-control create-survey-input"
                                    value={creatorName}  // Mostrar el nombre del usuario
                                    readOnly
                                />
                            </div>
                            <div className="text-center mt-4">
                                <button type="button" className="btn btn-primary" onClick={nextStep}>
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Pantalla 2 y 3 siguen siendo las mismas */}
            </div>
        </div>
    );
};
