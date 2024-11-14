import React, { useState, useEffect } from "react";
import "../../styles/createSurvey.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Usar la exportación nombrada

export const CreateSurvey = () => {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [status, setStatus] = useState("draft");
    const [creatorId, setCreatorId] = useState("");
    const [surveyId, setSurveyId] = useState(null); // Estado para almacenar el ID de la encuesta
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("multiple_choice");
    const [questions, setQuestions] = useState([]); // Estado para las preguntas
    const [options, setOptions] = useState({}); // Estado para almacenar las opciones de cada pregunta
    const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice de la pregunta actual
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setCreatorId(decodedToken.user_id);
        } else {
            alert("User not logged in");
        }
    }, []);

    const nextStep = async () => {
        if (step === 1 && title && description && startDate && endDate) {
            await handleSubmitSurvey(false); // Enviar datos de la encuesta
        }
        setStep((prev) => prev + 1);
    };

    const previousStep = () => setStep((prev) => prev - 1);

    // Esta función maneja la creación de la encuesta
    const handleSubmitSurvey = async (isFinalStep = true) => {
        if (title && description && startDate && endDate && creatorId) {
            const surveyData = {
                creator_id: creatorId,
                title,
                description,
                start_date: startDate,
                end_date: endDate,
                is_public: isPublic,
                status,
                type: "survey",
            };

            const token = localStorage.getItem("token");

            try {
                const response = await fetch('https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3001.app.github.dev/api/surveys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(surveyData),
                });

                const data = await response.json();

                if (response.ok) {
                    if (data.id) {
                        setSurveyId(data.id); // Guardar el ID de la encuesta
                        console.log("Survey ID received:", data.id);
                    } else {
                        console.error("Survey ID not found in response");
                    }
                } else {
                    console.error("Error:", data.message || "An unexpected error occurred.");
                    alert(`Error: ${data.message || "An unexpected error occurred."}`);
                }
            } catch (error) {
                console.error("Error sending data:", error);
                alert("An error occurred while sending the data.");
            }
        } else {
            alert("Complete all fields before submitting.");
        }
    };

    // Esta función maneja el envío de preguntas
    const handleAddQuestion = async () => {
        if (questionText.trim() !== "" && surveyId) {
            const questionData = {
                survey_id: surveyId,  // ID de la encuesta capturada
                question_text: questionText,  // Texto de la pregunta
                question_type: questionType,  // Tipo de pregunta
            };

            const token = localStorage.getItem("token");

            try {
                const response = await fetch('https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3001.app.github.dev/api/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(questionData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Question added successfully:", data);
                    // Si la respuesta es correcta, agrega la pregunta al estado
                    setQuestions((prevQuestions) => [...prevQuestions, { question_text: data.question_text, question_type: data.question_type, question_id: data.id }]); // Aquí añades el objeto completo
                    setQuestionText(""); // Limpiar el campo de texto
                    setSuccessMessage("Question created successfully"); // Mostrar mensaje de éxito
                } else {
                    console.error("Error:", data.message || "An unexpected error occurred.");
                    alert(`Error: ${data.message || "An unexpected error occurred."}`);
                }
            } catch (error) {
                console.error("Error sending data:", error);
                alert("An error occurred while sending the data.");
            }
        } else {
            alert("Please enter a valid question text or ensure the survey ID is set.");
        }
    };

    // Maneja la adición de opciones para una pregunta específica
    const handleAddOption = async (questionId, optionText) => {
        if (optionText.trim() !== "") {
            const token = localStorage.getItem("token");
            const optionData = {
                question_id: questionId,
                option_text: optionText,
                order: (options[questionId] || []).length + 1,
            };

            try {
                const response = await fetch('https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3001.app.github.dev/api/options', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(optionData),
                });

                const data = await response.json();

                if (response.ok) {
                    const updatedOptions = { ...options };
                    if (!updatedOptions[questionId]) {
                        updatedOptions[questionId] = [];
                    }
                    updatedOptions[questionId].push(optionText);
                    setOptions(updatedOptions);
                } else {
                    console.error("Error:", data.message || "An unexpected error occurred.");
                    alert(`Error: ${data.message || "An unexpected error occurred."}`);
                }
            } catch (error) {
                console.error("Error sending data:", error);
                alert("An error occurred while sending the data.");
            }
        }
    };

    return (
        <div className="create-survey-container">
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4 header-section">
                    <h2 className="display-5 fw-bold">Create a New Survey</h2>
                </div>

                {/* Página 1 */}
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
                                <label className="form-label">Public Survey?</label>
                                <div>
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            name="public"
                                            checked={isPublic === true}
                                            onChange={() => setIsPublic(true)}
                                        />
                                        Yes
                                    </label>
                                    <label className="form-check-label ms-4">
                                        <input
                                            type="radio"
                                            name="public"
                                            checked={isPublic === false}
                                            onChange={() => setIsPublic(false)}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 create-survey-btn"
                                    onClick={nextStep}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Página 2 */}
                {step === 2 && (
                    <div className="card shadow-sm border-0 mb-4 create-survey-card">
                        <form>
                            <h4>Create Questions</h4>
                            <div className="mb-3">
                                <label className="form-label">Question Text</label>
                                <input
                                    type="text"
                                    className="form-control create-survey-input"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Question Type</label>
                                <select
                                    className="form-select create-survey-input"
                                    value={questionType}
                                    onChange={(e) => setQuestionType(e.target.value)}
                                    required
                                >
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="open_ended">Open-ended</option>
                                </select>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 create-survey-btn"
                                    onClick={handleAddQuestion}
                                >
                                    Create Question
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary w-100 create-survey-btn"
                                    onClick={previousStep}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 create-survey-btn mt-3"
                                    onClick={nextStep}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Página 3 */}
                {step === 3 && (
                    <div className="card shadow-sm border-0 mb-4 create-survey-card">
                        <div className="text-center">
                            <h4>Review Questions and Add Options</h4>
                            {questions.length > 0 ? (
                                <ul>
                                    {questions.map((q, index) => (
                                        <li key={index}>
                                            <strong>Question {index + 1}: </strong>{q.question_text}
                                            {q.question_type === "multiple_choice" && (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Add an option"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && e.target.value.trim() !== "") {
                                                                handleAddOption(q.question_id, e.target.value);  // Send question ID
                                                                e.target.value = "";
                                                            }
                                                        }}
                                                    />
                                                    <ul className="mt-2">
                                                        {(options[q.question_id] || []).map((option, optionIndex) => (
                                                            <li key={optionIndex}>{option}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No questions added yet.</p>
                            )}
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                className="btn btn-primary w-100 create-survey-btn"
                                onClick={nextStep}
                            >
                                Next
                            </button>
                            <button
                                type="button"
                                className="btn btn-success w-100 create-survey-btn mt-3"
                                onClick={handleSubmitSurvey}
                            >
                                Submit Survey
                            </button>
                        </div>
                    </div>
                )}

                {/* Página 4 */}
                {step === 4 && (
                    <div className="card shadow-sm border-0 mb-4 create-survey-card">
                        <div className="text-center">
                            <h4>Review and Add Options to Each Question</h4>
                            {questions.length > 0 && currentQuestionIndex < questions.length ? (
                                <div>
                                    <div className="mb-3">
                                        <strong>Question: </strong>
                                        {questions[currentQuestionIndex].question_text}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Add an option"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && e.target.value.trim() !== "") {
                                                    handleAddOption(questions[currentQuestionIndex].question_id, e.target.value);  // Send question ID
                                                    e.target.value = "";
                                                }
                                            }}
                                        />
                                        <ul className="mt-2">
                                            {(options[questions[currentQuestionIndex].question_id] || []).map((option, optionIndex) => (
                                                <li key={optionIndex}>{option}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="text-center mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary w-100 create-survey-btn"
                                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                        >
                                            Next Question
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>No more questions to show.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
