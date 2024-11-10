// SurveyResults.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/surveyResults.css";
import { Context } from "../store/appContext";

const SurveyResults = () => {
    const { id } = useParams(); // Get the survey ID from the URL parameters
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { store, actions } = useContext(Context);

    useEffect(()=>{
        actions.getSurveys()       
    
      },[])
    

    useEffect(() => {
        // Mock data for demonstration purposes
        if (id === '1') {
            const exampleSurvey = {
                id: 1,
                title: "Customer Satisfaction Survey",
                description: "We value your feedback to improve our services.",
                creator_id: 101,
                start_date: "2024-10-01T00:00:00Z",
                end_date: "2024-12-31T00:00:00Z",
                status: "active",
                type: "survey",
                is_public: true,
                questions: [
                    {
                        question_text: "How would you rate our service?",
                        question_type: "scale",
                        options: [
                            { option_text: "1 - Very Poor" },
                            { option_text: "2 - Poor" },
                            { option_text: "3 - Average" },
                            { option_text: "4 - Good" },
                            { option_text: "5 - Excellent" }
                        ]
                    },
                    {
                        question_text: "What did you like most about our service?",
                        question_type: "open_ended",
                        options: []
                    },
                    {
                        question_text: "Would you recommend us to a friend?",
                        question_type: "yes_no",
                        options: [
                            { option_text: "Yes" },
                            { option_text: "No" }
                        ]
                    }
                ]
            };
            setSurvey(exampleSurvey);
            setLoading(false);
        } else {
            const fetchSurvey = async () => {
                try {
                    const response = await fetch(`/api/surveys/${id}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch survey data");
                    }
                    const data = await response.json();
                    setSurvey(data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching survey data:", error);
                    setError("Failed to load survey. Please try again later.");
                    setLoading(false);
                }
            };
            
            fetchSurvey();
        }
    }, [id]);

    if (loading) return <div className="loading">Loading survey...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="view-survey-container">
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4 header-section">
                    <h2 className="display-5 fw-bold">{survey.title}</h2>
                    <p className="lead">{survey.description}</p>
                    <div className="survey-details mt-4">
                        <p><strong>Created by:</strong> User {survey.creator_id}</p>
                        <p><strong>Start Date:</strong> {new Date(survey.start_date).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(survey.end_date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {survey.status}</p>
                        <p><strong>Type:</strong> {survey.type}</p>
                        <p><strong>Visibility:</strong> {survey.is_public ? "Public" : "Private"}</p>
                    </div>
                </div>

                {/* Display questions if available */}
                <section className="questions-section mt-5">
                    <h3 className="mb-4">Questions</h3>
                    {survey.questions && survey.questions.length > 0 ? (
                        <div className="question-list">
                            {survey.questions.map((question, index) => (
                                <div key={index} className="card shadow-sm border-0 mb-4 question-card">
                                    <div className="card-body">
                                        <h5 className="card-title">{index + 1}. {question.question_text}</h5>
                                        <p className="card-text"><strong>Type:</strong> {question.question_type}</p>
                                        {question.options && question.options.length > 0 && (
                                            <ul className="options-list">
                                                {question.options.map((option, optionIndex) => (
                                                    <li key={optionIndex} className="option-item">
                                                        {option.option_text}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No questions found for this survey.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default SurveyResults;