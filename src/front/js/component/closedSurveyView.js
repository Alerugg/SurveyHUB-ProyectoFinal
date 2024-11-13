// ClosedSurveyView.js

import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import "../../styles/closedSurveyView.css";

const ClosedSurveyView = ({ survey }) => {
    const questionData = survey.questions.map((question, index) => {
        return {
            labels: question.options.map(option => option.option_text),
            datasets: [
                {
                    label: `Resultados para la pregunta ${index + 1}: ${question.question_text}`,
                    data: question.options.map(option => option.votes_count),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }
            ]
        };
    });

    return (
        <div className="closed-survey-view">
            <h2>Resultados de la encuesta</h2>
            <p>{survey.title}</p>
            <div className="charts-container">
                {questionData.map((data, index) => (
                    <div key={index} className="chart-wrapper">
                        <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClosedSurveyView;
