import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/surveys.css";
import { Context } from "../store/appContext";
import { IoMdSearch } from "react-icons/io";

export const AvailableSurveys = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [filterStatus, setFilterStatus] = useState("all"); // Estado para el filtro de estado
    const navigate = useNavigate();

    useEffect(() => {
        actions.getSurveys();
    }, []);

    const handleSurveyClick = (id) => {
        navigate(`/surveys/${id}`);
    };

    if (!store.surveys || store.surveys.length === 0) {
        return <div className="loading-container">
            <span className="available-surveys-loading">Loading...</span>
            <div className="spinner"></div>
        </div>;
    }

    // Filtrar las encuestas por el término de búsqueda
    let filteredSurveys = store.surveys.filter(survey =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar las encuestas por estado
    if (filterStatus !== "all") {
        filteredSurveys = filteredSurveys.filter(survey => survey.status.toLowerCase() === filterStatus.toLowerCase());
    }

    // Ordenar las encuestas por fecha de finalizacion en orden ascendente
    filteredSurveys.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));

    //Funcion que trunca el texto a 70 caracteres
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "..."; // Agrega "..." si se trunca
        }
        return text;
    };

    return (
        <div className="available-surveys-container">
            <h1 className="available-surveys-title text-center">Explore all surveys</h1>

            {/* Campo de búsqueda */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="search-drop"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoMdSearch className="search-icon" />
            </div>

            {/* Filtros de estado en forma de dropdown */}
            <div className="filter-section">
                <div className="dropdown">
                    <button className="dropdown-toggle filter-drop" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        {filterStatus === "all" ? "Filter: All" : `Filter: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><button className="dropdown-item" type="button" onClick={() => setFilterStatus("all")}>All</button></li>
                        <li><button className="dropdown-item" type="button" onClick={() => setFilterStatus("active")}>Active</button></li>
                        <li><button className="dropdown-item" type="button" onClick={() => setFilterStatus("closed")}>Closed</button></li>
                        <li><button className="dropdown-item" type="button" onClick={() => setFilterStatus("draft")}>Pending</button></li>
                    </ul>
                </div>
            </div>
            <div className="available-surveys-list">
                {filteredSurveys.map((survey) => (
                    <div key={survey.id} className="available-survey-card" onClick={() => handleSurveyClick(survey.id)}>
                        <div className="available-survey-card-header">
                            <img src={`https://loremflickr.com/600/400?random=${survey.id}`} alt="Survey" className="available-survey-image" />
                            <div className={`available-survey-status-header ${survey.is_public ? 'public' : 'private'}`}>
                                {survey.is_public ? 'Public' : 'Private'}
                            </div>
                        </div>
                        <div className="available-survey-card-body">
                            <div className="available-survey-card-body">
                                <div className="card-title-container">
                                    <h3 className="available-survey-card-title">{survey.title}</h3>
                                    <span className={`available-status-badge-title ${survey.status.toLowerCase()}`}>
                                        {survey.status}
                                    </span>
                                </div>
                                <p className="available-survey-card-description">
                                    {truncateText(survey.description, 90)}
                                </p>
                                <div className="available-survey-card-footer">
                                    <p className="available-survey-card-dates">
                                        Available until: {new Date(survey.end_date).toLocaleDateString()}
                                    </p>
                                    <div className="available-survey-goal">
                                        Responses goal: <br /><span>{survey.currentResponses}of{survey.totalResponses}</span>
                                        <img src="https://avatar.iran.liara.run/public" alt="Creator" className="available-survey-creator-avatar" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
