// UserDashboard.js
import React, { useContext, useEffect } from 'react';
import "../../styles/dashboard.css";
import { Context } from '../store/appContext';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getSurveys();      
        actions.getUserProfile();  // Asegurarse de cargar el perfil del usuario
        if (store.user) {
            actions.getUserVotedSurveys(store.user.id);  // Cargar las encuestas votadas por el usuario
        }
    }, [store.user]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header jumbotron">
                <div className="header-content">
                    <div className="user-info">
                        <img className="user-avatar" src="https://via.placeholder.com/150" alt="User Avatar" />
                        <div className="user-details">
                            <h1>Welcome {store.user ? store.user.full_name : "Guest"}</h1>
                            <p className="user-role">Survey expert</p>
                            <a href="/edit-profile" className="edit-profile">Edit profile</a>
                        </div>
                    </div>
                    <div className="annual-interactions">
                        <div className="progress-ring"></div>
                        <h2>23,648</h2>
                        <p>Annual Interactions</p>
                    </div>
                </div>
                <div className="user-stats">
                    <div className="stat-item">
                        <p className="stat-title">Survey views</p>
                        <h2 className="stat-value">50.8K <span className="stat-change positive">28.4% &#x2191;</span></h2>
                    </div>
                    <div className="stat-item">
                        <p className="stat-title">Monthly users</p>
                        <h2 className="stat-value">23.6K <span className="stat-change negative">12.6% &#x2193;</span></h2>
                    </div>
                    <div className="stat-item">
                        <p className="stat-title">Surveys uploaded</p>
                        <h2 className="stat-value">756 <span className="stat-change positive">3.1% &#x2191;</span></h2>
                    </div>
                    <div className="stat-item">
                        <p className="stat-title">Subscriptions</p>
                        <h2 className="stat-value">2.3K <span className="stat-change positive">11.3% &#x2191;</span></h2>
                    </div>
                </div>
            </div>
            <div className="active-surveys">
                <h2>Your active surveys</h2>
                <div className="survey-list">
                    {store.surveys && store.user && store.surveys.filter(survey => survey.creator_id === store.user.id).map((survey, index) => (
                        <div key={index} className="survey-card">
                            <img src="https://via.placeholder.com/300" alt="Survey" />
                            <h3>{survey.title}</h3>
                            <p>{survey.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="past-surveys">
                <h2>Explore your past surveys <span className="explore-link" onClick={() => navigate(`/surveys/created/${store.user?.id}`)}>Explore more</span></h2>
                <div className="survey-list">
                    {store.surveys && store.user && store.surveys.filter(survey => survey.status === 'closed' && survey.creator_id === store.user.id).map((survey, index) => (
                        <div key={index} className="survey-card">
                            <img src="https://via.placeholder.com/300" alt="Survey" />
                            <h3>{survey.title}</h3>
                            <p>{survey.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="recent-voting">
                <h2>What have you been voting on recently? <span className="explore-link">Explore more</span></h2>
                <div className="voting-list">
                    {store.user && store.userVotedSurveys && store.userVotedSurveys.map((survey, index) => (
                        <div key={index} className="voting-card">
                            <img src="https://via.placeholder.com/300" alt="Campaign" />
                            <h3>{survey.title}</h3>
                            <p>{survey.description}</p>
                            <span className="powered-by">Powered by {survey.creator_name || 'Anonymous'}</span>
                            <Link to={`/surveys/${survey.id}`} className="explore-results">Explore results</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

