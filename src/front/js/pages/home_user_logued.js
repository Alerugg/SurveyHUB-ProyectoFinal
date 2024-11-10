import React, { useContext } from "react";
import "../../styles/home_user_logued.css";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const HomeUserLogued = () => {
    const { store, actions } = useContext(Context);

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
                                    <img src="https://placehold.co/600x400?text=Survey+Image+Placeholder" alt="Survey Placeholder" className="card-img-top survey-img" />
                                    <div className="card-body">
                                        <h5 className="card-title">Survey title {index + 1}</h5>
                                        <p className="card-text">A brief description of the survey...</p>
                                        <span className="badge active-badge mb-2">Active</span>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <span>Responses goal: <strong>40/100</strong></span>
                                            <Link to={`/survey/${index}`} className="btn btn-sm view-details-btn">View details</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Surveys Section */}
                <section className="mt-5 popular-surveys-section">
                    <h2 className="mb-4">Browse today's most popular surveys</h2>
                    <div className="row">
                        {[1, 2, 3, 4].map((survey, index) => (
                            <div key={index} className="col-md-3 mb-4">
                                <div className="card shadow-sm border-0 survey-card">
                                    <img src="https://placehold.co/600x400?text=Popular+Survey+Placeholder" alt="Popular Survey Placeholder" className="card-img-top survey-img" />
                                    <div className="card-body">
                                        <h5 className="card-title">Popular survey {index + 1}</h5>
                                        <p className="card-text">A brief description...</p>
                                        <Link to={`/vote/${index}`} className="btn btn-sm vote-now-btn">Vote now</Link>
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