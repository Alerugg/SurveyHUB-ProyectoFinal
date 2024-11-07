import React, { useState } from "react";
import "../../styles/createSurvey.css";
import { useNavigate } from "react-router-dom";

export const CreateSurvey = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("multiple_choice");
    const [options, setOptions] = useState([""]);

    const navigate = useNavigate();

    const handleAddOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, "");
        setOptions(newOptions);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleAddQuestion = () => {
        if (questionText.trim() && options.every(option => option.trim() !== "")) {
            setQuestions([
                ...questions,
                {
                    text: questionText,
                    type: questionType,
                    options: [...options],
                },
            ]);
            setQuestionText("");
            setOptions([""]);
        } else {
            alert("Por favor, complete la pregunta y todas las opciones.");
        }
    };

    const handleVisibilityChange = (value) => {
        if (value === "public") {
            setIsPublic(true);
        } else {
            setIsPublic(false);
        }
    };

    const handleSubmitSurvey = () => {
        if (title && description && startDate && endDate && questions.length > 0) {
            const surveyData = {
                title,
                description,
                startDate,
                endDate,
                isPublic,
                questions,
            };
            console.log("Datos de la encuesta completa:", surveyData);
            alert("Encuesta creada correctamente.");
            navigate("/surveys"); // Navega a la página de encuestas (ruta ajustable)
        } else {
            alert("Debe completar todos los campos y agregar al menos una pregunta antes de enviar la encuesta.");
        }
    };

    return (
        <div style={{ backgroundColor: "#1e1f24", padding: "20px", minHeight: "100vh" }}>
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                    <h2 className="display-5 fw-bold">Crea una Nueva Encuesta</h2>
                </div>

                {/* Formulario de Información Básica */}
                <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px", padding: "20px" }}>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Título de la encuesta</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha de inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha de finalización</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                            />
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isPublic}
                                onChange={() => handleVisibilityChange("public")}
                                id="publicSurvey"
                            />
                            <label className="form-check-label" htmlFor="publicSurvey">Pública</label>
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={!isPublic}
                                onChange={() => handleVisibilityChange("private")}
                                id="privateSurvey"
                            />
                            <label className="form-check-label" htmlFor="privateSurvey">Privada</label>
                        </div>
                    </form>
                </div>

                {/* Formulario de Preguntas y Opciones */}
                <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px", padding: "20px" }}>
                    <h4>Agregar Preguntas y Opciones</h4>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Texto de la pregunta</label>
                            <input
                                type="text"
                                className="form-control"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                required
                                style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo de pregunta</label>
                            <select
                                className="form-select"
                                value={questionType}
                                onChange={(e) => setQuestionType(e.target.value)}
                                style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                            >
                                <option value="multiple_choice">Elección múltiple</option>
                                <option value="yes_no">Sí/No</option>
                                <option value="open_ended">Abierta</option>
                                <option value="scale">Escala</option>
                            </select>
                        </div>
                        {questionType === "multiple_choice" && (
                            <div className="mb-3">
                                <label className="form-label">Opciones</label>
                                {options.map((option, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            required
                                            style={{ borderRadius: "10px", backgroundColor: "#3a3b3f", color: "#ffffff" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger ms-2"
                                            onClick={() => handleRemoveOption(index)}
                                            style={{ borderRadius: "10px" }}
                                        >
                                            Eliminar
                                        </button>
                                        {index === options.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary ms-2"
                                                onClick={() => handleAddOption(index)}
                                                style={{ borderRadius: "10px" }}
                                            >
                                                Añadir opción
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <button type="button" className="btn btn-primary mt-3" onClick={handleAddQuestion} style={{ backgroundColor: "#6a0dad", border: "none", borderRadius: "20px" }}>
                            Agregar pregunta
                        </button>
                    </form>
                </div>

                {/* Botón para enviar la encuesta */}
                <div className="text-center mt-4">
                    <button type="button" className="btn btn-success" onClick={handleSubmitSurvey} style={{ borderRadius: "20px" }}>
                        Crear Encuesta
                    </button>
                </div>
            </div>
        </div>
    );
};
