// CreateSurvey.js
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
    const [inviteEmails, setInviteEmails] = useState([""]);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);

    const navigate = useNavigate();

    const handleSuggestQuestions = async () => {
        if (!title.trim()) {
            alert("Please enter a topic for the survey title to get suggestions.");
            return;
        }

        try {
            const response = await axios.post("/api/suggest_questions", { topic: title });
            setSuggestedQuestions(response.data.questions);
        } catch (error) {
            console.error("Error fetching suggested questions:", error);
            alert("There was an error fetching suggestions. Please try again later.");
        }
    };

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

    const handleAddInviteEmail = (index) => {
        const newEmails = [...inviteEmails];
        newEmails.splice(index + 1, 0, "");
        setInviteEmails(newEmails);
    };

    const handleInviteEmailChange = (index, value) => {
        const newEmails = [...inviteEmails];
        newEmails[index] = value;
        setInviteEmails(newEmails);
    };

    const handleRemoveInviteEmail = (index) => {
        if (inviteEmails.length > 1) {
            setInviteEmails(inviteEmails.filter((_, i) => i !== index));
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
            alert("Please complete the question and all options.");
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
                inviteEmails: isPublic ? [] : inviteEmails,
            };
            console.log("Survey data:", surveyData);
            alert("Survey created successfully.");
            navigate("/surveys"); // Navigate to surveys page
        } else {
            alert("All fields must be completed and at least one question must be added before submitting the survey.");
        }
    };

    return (
        <div className="create-survey-container">
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4 header-section">
                    <h2 className="display-5 fw-bold">Create a New Survey</h2>
                </div>

                {/* Basic Information Form */}
                <div className="card shadow-sm border-0 mb-4 create-survey-card">
                    <form>
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
                        <div className="form-check mb-3">
                            <input
                                type="radio"
                                className="form-check-input"
                                checked={isPublic}
                                onChange={() => handleVisibilityChange("public")}
                                id="publicSurvey"
                            />
                            <label className="form-check-label" htmlFor="publicSurvey">Public</label>
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="radio"
                                className="form-check-input"
                                checked={!isPublic}
                                onChange={() => handleVisibilityChange("private")}
                                id="privateSurvey"
                            />
                            <label className="form-check-label" htmlFor="privateSurvey">Private</label>
                        </div>
                        {!isPublic && (
                            <div className="mb-3">
                                <label className="form-label">Invite Emails</label>
                                {inviteEmails.map((email, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <input
                                            type="email"
                                            className="form-control create-survey-input"
                                            value={email}
                                            onChange={(e) => handleInviteEmailChange(index, e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger ms-2 remove-btn"
                                            onClick={() => handleRemoveInviteEmail(index)}
                                        >
                                            Remove
                                        </button>
                                        {index === inviteEmails.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary ms-2 add-btn"
                                                onClick={() => handleAddInviteEmail(index)}
                                            >
                                                Add Email
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>

                {/* Questions and Options Form */}
                <div className="card shadow-sm border-0 mb-4 create-survey-card">
                    <h4>Add Questions and Options</h4>
                    <form>
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
                            >
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="yes_no">Yes/No</option>
                            </select>
                        </div>
                        {questionType === "multiple_choice" && (
                            <div className="mb-3">
                                <label className="form-label">Options</label>
                                {options.map((option, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <input
                                            type="text"
                                            className="form-control create-survey-input"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger ms-2 remove-btn"
                                            onClick={() => handleRemoveOption(index)}
                                        >
                                            Remove
                                        </button>
                                        {index === options.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary ms-2 add-btn"
                                                onClick={() => handleAddOption(index)}
                                            >
                                                Add Option
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Suggested Questions Section */}
                        <div className="mb-3">
                            <button type="button" className="btn btn-info" onClick={handleSuggestQuestions}>
                                Get Suggested Questions
                            </button>
                        </div>
                        {suggestedQuestions.length > 0 && (
                            <div className="mb-3">
                                <h5>Suggested Questions:</h5>
                                {suggestedQuestions.map((question, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <input
                                            type="text"
                                            className="form-control create-survey-input"
                                            value={question}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary ms-2 add-btn"
                                            onClick={() => setQuestions([...questions, { text: question, type: 'multiple_choice', options: [] }])}
                                        >
                                            Add to Survey
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" className="btn btn-primary mt-3 add-question-btn" onClick={handleAddQuestion}>
                            Add Question
                        </button>
                    </form>
                </div>

                {/* Submit Survey Button */}
                <div className="text-center mt-4">
                    <button type="button" className="btn btn-success submit-survey-btn" onClick={handleSubmitSurvey}>
                        Create Survey
                    </button>
                </div>
            </div>
        </div>
    );
};
