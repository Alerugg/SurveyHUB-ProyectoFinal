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
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", minHeight: "100vh" }}>
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#3F374D", color: "#ffffff", borderRadius: "20px" }}>
                    <h2 className="display-5 fw-bold">Create a New Survey</h2>
                </div>

                {/* Basic Information Form */}
                <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: "rgba(63, 55, 77, 0.5)" , color: "#333333", borderRadius: "20px", padding: "20px" }}>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Survey Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
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
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => handleInviteEmailChange(index, e.target.value)}
                                            required
                                            style={{ borderRadius: "10px" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger ms-2"
                                            onClick={() => handleRemoveInviteEmail(index)}
                                            style={{ borderRadius: "10px" }}
                                        >
                                            Remove
                                        </button>
                                        {index === inviteEmails.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary ms-2"
                                                onClick={() => handleAddInviteEmail(index)}
                                                style={{ borderRadius: "10px" }}
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
                <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: "rgba(63, 55, 77, 0.5)" , color: "#333333", borderRadius: "20px", padding: "20px" }}>
                    <h4>Add Questions and Options</h4>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Question Text</label>
                            <input
                                type="text"
                                className="form-control"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Question Type</label>
                            <select
                                className="form-select"
                                value={questionType}
                                onChange={(e) => setQuestionType(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            >
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="yes_no">Yes/No</option>
                                <option value="open_ended">Open Ended</option>
                                <option value="scale">Scale</option>
                            </select>
                        </div>
                        {questionType === "multiple_choice" && (
                            <div className="mb-3">
                                <label className="form-label">Options</label>
                                {options.map((option, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            required
                                            style={{ borderRadius: "10px" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger ms-2"
                                            onClick={() => handleRemoveOption(index)}
                                            style={{ borderRadius: "10px" }}
                                        >
                                            Remove
                                        </button>
                                        {index === options.length - 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary ms-2"
                                                onClick={() => handleAddOption(index)}
                                                style={{ borderRadius: "10px" }}
                                            >
                                                Add Option
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <button type="button" className="btn btn-primary mt-3" onClick={handleAddQuestion} style={{ backgroundColor: "#3F374D", border: "none", borderRadius: "20px", transition: "none" }} onMouseOver={(e) => { e.target.style.transform = "scale(1.05)" }} onMouseOut={(e) => { e.target.style.transform = "scale(1)" }}>
                            Add Question
                        </button>
                    </form>
                </div>

                {/* Submit Survey Button */}
                <div className="text-center mt-4">
                    <button type="button" className="btn btn-success" onClick={handleSubmitSurvey} style={{ fontSize: '1.5rem', padding: '15px 50px', backgroundColor: "#3F374D", border: "none", borderRadius: "20px", transition: "none" }} onMouseOver={(e) => { e.target.style.transform = "scale(1.05)" }} onMouseOut={(e) => { e.target.style.transform = "scale(1)" }}>
                        Create Survey
                    </button>
                </div>
            </div>
        </div>
    );
};