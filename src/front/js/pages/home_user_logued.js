import React, { useContext, useEffect } from "react";
import "../../styles/home_user_logued.css";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const HomeUserLogued = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(()=>{
        actions.getSurveys();      
      },[]);
    
    return (
        <div className="home-user-container">
            {/* Header Section */}
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4 header-section">
                    <h1 className="display-4 fw-bold">It's time to create your amazing surveys</h1>
                    <p className="lead">Organize a dinner party, get insight from your users for your small business, and much more.</p>
                    <Link to="/create_survey" className="btn btn-lg create-survey-btn mt-3">Create survey</Link>
                </div>

                {/* Active Surveys Section */}
                <section className="active-surveys-section">
                    <h2 className="mb-4">Your active surveys</h2>
                    <div className="row">
                        {[1, 2].map((survey, index) => (
                            <div key={index} className="col-md-6 mb-4">
                                <div className="card shadow-sm border-0 survey-card">
                                    <img src="https://placehold.co/1200x400?text=Survey+Image+Placeholder" alt="Survey Placeholder" className="card-img-top survey-img" />
                                    <div className="card-body">
                                        <h4 className="card-title mb-3">Survey title {index + 1}</h4>
                                        <p className="card-text mb-2">A brief description of the survey goes here, providing insight into what the survey is about and why it is important.</p>
                                        <p className="card-text mb-2"><strong>Status:</strong> <span className="badge active-badge">Active</span></p>
                                        <p className="card-text mb-2"><strong>Responses goal:</strong> 40/100</p>
                                        <p className="card-text mb-2"><strong>End Date:</strong> {new Date().toLocaleDateString()}</p>
                                        <div className="d-flex justify-content-end mt-4">
                                            <Link to={`/survey/${index}`} className="btn btn-lg view-details-btn">View details</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn all-surveys-btn mt-3" onClick={() => navigate('/surveys')}>All Surveys</button>
                </section>

                {/* Open Surveys to Vote Section */}
                <section className="mt-5 popular-surveys-section">
                    <h2 className="mb-4">Open Surveys to Vote</h2>
                    <div className="row">
                        {store.surveys.filter(survey => survey.is_public).map((survey, index) => (
                            <div key={index} className="col-md-6 col-lg-4 mb-4">
                                <div className="card shadow-sm border-0 survey-card">
                                    <img src="https://placehold.co/600x400?text=Open+Survey+Placeholder" alt="Open Survey Placeholder" className="card-img-top survey-img" />
                                    <div className="card-body">
                                        <h5 className="card-title">{survey.title}</h5>
                                        <p className="card-text">{survey.description}</p>
                                        <p className="card-text"><strong>Creator:</strong> {survey.creator_name || 'Anonymous'}</p>
                                        <p className="card-text"><strong>End Date:</strong> {new Date(survey.end_date).toLocaleDateString()}</p>
                                        <Link to={`/surveys/${survey.id}`} className="btn btn-sm participate-btn">Participate</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
