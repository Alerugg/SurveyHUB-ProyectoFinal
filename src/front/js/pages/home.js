import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import example from "/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/roadmapexample.png";
import { GrActions } from "react-icons/gr";
import Header from "/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/img/homeimg.png";

export const Home = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getSurveys();
  }, [actions]);

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="row container-surveys">
        <div className="col-12 col-xs-12 col-md-12 col-lg-12 header-home text-center">
          <h1 className="home-title">It's time to create your<br />
            amazing surveys
          </h1>
          <p className="lead">
            Organize a dinner party, get insight from your users for your small business, and much more.
          </p>
          <Link to="/register" className="btn btn-lg home-signup-btn">Get started</Link>
          <div className="col-12 col-sm-6 col-md-4 mb-4 headerimg">
            <img src={Header} alt="header-img" className="header-img"></img>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <section className=" why-part">
          <p className="why-evote text-center">Why Evote?</p>
          <p className="why-text text-center">“Participating in our surveys is easy: simply sign up, choose the surveys that interest you<br />
            most, share your opinions and start earning rewards for every answer you complete.”</p>
          <div className="row card-container">
            <div className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card home-cards mb-4">
                <h1>Easy to use.</h1>
                <p>
                  The application has a clean and accessible design that makes it easy to navigate, allowing beginners and experts to create surveys without the need for technical training.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card home-cards mb-4">
                <h1>Real-time Analytics.</h1>
                <p>
                  Another key advantage is the ability to perform real-time data analysis. As survey responses come in, our application provides instant graphs and statistics that help you understand the opinion of respondents. This means that you don't have to wait days or weeks for trends and patterns; you can make informed decisions immediately.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="card home-cards mb-4">
                <h1>Customization and Flexibility</h1>
                <p>
                  Finally, our application offers great flexibility and customization options to suit your specific needs. You can design surveys with different question formats, such as multiple choice or open-ended questions, and add your own branding to reflect your brand's identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Roadmap Section */}
        <section className="mt-5 work-part">
          <h2 className="mb-4 text-center">How we work?</h2>
          <div className="text-center">
          </div>
        </section>

        {/* Hot Public Surveys Section */}
        <section className="mt-5 hot-surveys-section">
          <h2 className="mb-4 text-center">Hot Public Surveys</h2>
          <div className="row">
            {store.surveys.map((survey, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4 mb-4">
                <div className="card shadow-sm border-0 hot-survey-card">
                  <img src="https://placehold.co/600x400" className="card-img-top hot-survey-img img-fluid" alt="Hot Survey" />
                  <div className="card-body">
                    <h5 className="card-title">Hot Survey {survey.title}</h5>
                    <p className="card-text">{survey.description}</p>
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