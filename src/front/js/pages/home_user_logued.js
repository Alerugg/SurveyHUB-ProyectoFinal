import React, { useContext, useEffect } from "react";
import "../../styles/home_user_logued.css";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const HomeUserLogued = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getSurveys();      
    }, []);
    
    return (
        <div className="home-user-logued-container">
            <div className="home-user-logued-background">
                {/* Header Section */}
                <div className="home-user-logued-content mt-5">
                    <div className="home-user-logued-header text-center p-5 mb-4">
                        <h1 className="home-user-logued-title fw-bold">It's time to create your amazing surveys</h1>
                        <p className="home-user-logued-subtitle">Organize a dinner party, get insight from your users for your small business, and much more.</p>
                        <Link to="/create_survey" className="home-user-logued-create-btn btn-lg mt-3">Create survey</Link>
                    </div>

                    {/* Active Surveys Section */}
                    <section className="home-user-logued-active-section">
                        <h2 className="home-user-logued-section-title mb-4">Your active surveys</h2>
                        <div className="row">
                            {[1, 2].map((survey, index) => (
                                <div key={index} className="col-12 col-lg-6 mb-4">
                                    <div className="home-user-logued-large-card card shadow-sm border-0">
                                        <img src="https://placehold.co/1200x400?text=Survey+Image+Placeholder" alt="Survey Placeholder" className="home-user-logued-survey-img" />
                                        <div className="home-user-logued-card-body card-body">
                                            <h4 className="home-user-logued-card-title mb-3">Survey title {index + 1}</h4>
                                            <p className="home-user-logued-card-text mb-2">A brief description of the survey goes here, providing insight into what the survey is about and why it is important.</p>
                                            <p className="home-user-logued-card-text mb-2"><strong>Status:</strong> <span className="home-user-logued-active-badge badge">Active</span></p>
                                            <p className="home-user-logued-card-text mb-2"><strong>Responses goal:</strong> 40/100</p>
                                            <p className="home-user-logued-card-text mb-2"><strong>End Date:</strong> {new Date().toLocaleDateString()}</p>
                                            <div className="d-flex justify-content-end mt-4">
                                                <Link to={`/survey/${index}`} className="home-user-logued-view-details-btn btn-lg">View details</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="home-user-logued-all-surveys-btn btn mt-3" onClick={() => navigate('/surveys')}>All Surveys</button>
                    </section>

                    {/* Open Surveys to Vote Section */}
                    <section className="home-user-logued-popular-section mt-5">
                        <h2 className="home-user-logued-section-title mb-4">Open Surveys to Vote</h2>
                        <div className="row">
                            {store.surveys.filter(survey => survey.is_public).map((survey, index) => (
                                <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                                    <div className="home-user-logued-small-card card shadow-sm border-0">
                                        <img src="https://placehold.co/600x400?text=Open+Survey+Placeholder" alt="Open Survey Placeholder" className="home-user-logued-popular-img" />
                                        <div className="home-user-logued-popular-body card-body">
                                            <h5 className="home-user-logued-popular-title">{survey.title}</h5>
                                            <p className="home-user-logued-popular-description">{survey.description}</p>
                                            <p className="home-user-logued-popular-creator"><strong>Creator:</strong> {survey.creator_name || 'Anonymous'}</p>
                                            <p className="home-user-logued-popular-end-date"><strong>End Date:</strong> {new Date(survey.end_date).toLocaleDateString()}</p>
                                            <Link to={`/surveys/${survey.id}`} className="home-user-logued-participate-btn btn-sm">Participate</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
