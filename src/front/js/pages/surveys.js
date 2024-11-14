import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/surveys.css";
import { Context } from "../store/appContext";
import { SurveyCard } from "../component/card";

export const AvailableSurveys = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        actions.getSurveys();
    }, []);

    const handleSurveyClick = (id) => {
        navigate(`/surveys/${id}`);  // Navegar a la ruta de SurveyResults con el ID correcto
    };

    const handleVisibilityFilterChange = (e) => {
        setVisibilityFilter(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredSurveys = store.surveys.filter((survey) => {
        const visibilityMatch =
            visibilityFilter === "all" ||
            (visibilityFilter === "public" && survey.is_public) ||
            (visibilityFilter === "private" && !survey.is_public);

        const statusMatch =
            statusFilter === "all" ||
            (statusFilter === "active" && survey.status.toLowerCase() === "active") ||
            (statusFilter === "pending" && survey.status.toLowerCase() === "draft") ||
            (statusFilter === "closed" && survey.status.toLowerCase() === "closed");

        return visibilityMatch && statusMatch;
    });

    if (!store.surveys || store.surveys.length === 0) {
        return <div className="loading">Loading available surveys...</div>;
    }

    return (
        <div className="available-surveys-container">
            <h2 className="available-surveys-title">Available Surveys</h2>
            <div className="filter-container">
                <div className="filter-group">
                    <label htmlFor="visibility-filter">Visibility: </label>
                    <select id="visibility-filter" value={visibilityFilter} onChange={handleVisibilityFilterChange}>
                        <option value="all">All</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="status-filter">Status: </label>
                    <select id="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>
            <div className="surveys-list">
                {filteredSurveys.map((survey) => (
                    <SurveyCard key={survey.id} survey={survey} onClick={() => handleSurveyClick(survey.id)} />
                ))}
            </div>
        </div>
    );
};