import React from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import example from "/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/roadmapexample.png";

export const Home = () => {
  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="container mt-5">
        <div className="jumbotron text-center p-5 mb-4 header-section">
          <h1 className="display-4 fw-bold">Welcome to PulseSurvey</h1>
          <p className="lead">Discover how our surveys can help you gather valuable insights and make better decisions.</p>
          <div className="mt-4">
            <Link to="/login" className="btn btn-lg login-btn mx-2">Login</Link>
            <Link to="/register" className="btn btn-lg signup-btn mx-2">Sign Up</Link>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <section className="mt-5 feature-highlights">
          <h2 className="mb-4">Why Choose PulseSurvey?</h2>
          <div className="row">
            {[{ title: "Easy to Use", desc: "Create surveys in minutes with our intuitive interface." },
              { title: "Quick Results", desc: "Access your results in real-time." },
              { title: "Collaborate Easily", desc: "Share surveys and analyze responses with your team." }].map((feature, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card shadow-sm border-0 feature-card">
                    <div className="card-body text-center">
                      <h5 className="card-title">{feature.title}</h5>
                      <p className="card-text">{feature.desc}</p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </section>

        {/* Example Roadmap Section */}
        <section className="mt-5 roadmap-section">
          <h2 className="mb-4">See How It Works</h2>
          <div className="text-center">
            <img src={example} alt="Example Roadmap" className="img-fluid roadmap-image" />
          </div>
        </section>

        {/* Hot Public Surveys Section */}
        <section className="mt-5 hot-surveys-section">
          <h2 className="mb-4">Hot Public Surveys</h2>
          <div className="row">
            {[1, 2, 3, 4].map((survey, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 hot-survey-card">
                  <img src="https://placehold.co/600x400" className="card-img-top hot-survey-img" alt="Hot Survey" />
                  <div className="card-body">
                    <h5 className="card-title">Hot Survey {index + 1}</h5>
                    <p className="card-text">A brief description...</p>
                    <Link to={`/survey/${index}`} className="btn btn-sm participate-btn">Participate now</Link>
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
