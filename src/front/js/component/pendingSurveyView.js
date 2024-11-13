import React from 'react';
import "../../styles/pendingSurveyView.css";

const PendingSurveyView = ({ survey }) => {
    return (
        <div className="pending-survey-view">
            <h2>La encuesta está en espera</h2>
            <p>{survey.title}</p>
            <p>Esta encuesta comenzará el: {new Date(survey.start_date).toLocaleString()}</p>
            <div className="countdown-timer">
                Falta tiempo para comenzar...
            </div>
        </div>
    );
};

export default PendingSurveyView;
