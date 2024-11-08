import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";



export const HomeUserLogued = () => {
    const { store, actions } = useContext(Context);

    return (
        <div style={{ backgroundColor: "white",
         padding: "20px", minHeight: "100vh" }}>
            {/* Header Section */}
            <div className="container mt-5">
                <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                    <h1 className="display-5 fw-bold">Crea tus encuestas asombrosas</h1>
                    <p className="lead">Obtén información de tus usuarios para tu negocio y más.</p>
                    <Link to="/create_survey" className="btn btn-primary btn-lg mt-3" style={{ backgroundColor: "#6a0dad", border: "none", borderRadius: "20px" }}>Crear encuesta</Link>
                </div>

                {/* Active Surveys Section */}
                <section>
                    <h2 className="mb-4" style={{ color: "#ffffff" }}>Encuestas activas:</h2>
                    <div className="row">
                        {[1, 2].map((survey, index) => (
                            <div key={index} className="col-md-6 mb-4">
                                <div className="card shadow-sm border-0" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Nombre de la encuesta {index + 1}</h5>
                                        <p className="card-text">Descripción breve de la encuesta...</p>
                                        <span className="badge bg-success mb-2" style={{ borderRadius: "10px" }}>Activo</span>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <span>Respuestas: <strong>40/100</strong></span>
                                            <Link to={`/survey/${index}`} className="btn btn-outline-light btn-sm" style={{ borderRadius: "10px"}}>Ver detalles</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Surveys Section */}
                <section className="mt-5">
                    <h2 className="mb-4" style={{ color: "#ffffff" }}>Explora las encuestas más populares de hoy</h2>
                    <div className="row">
                        {[1, 2, 3, 4].map((survey, index) => (
                            <div key={index} className="col-md-3 mb-4">
                                <div className="card shadow-sm border-0" style={{ backgroundColor: "#2a2c31", color: "#ffffff", borderRadius: "20px" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Encuesta popular {index + 1}</h5>
                                        <p className="card-text">Una breve descripción...</p>
                                        <Link to={`/vote/${index}`} className="btn btn-outline-light btn-sm" style={{ borderRadius: "10px" }}>Votar ahora</Link>
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



// import React, { useContext } from "react";
// import { Context } from "../store/appContext";
// import "../../styles/home.css";
// import { Link } from "react-router-dom";
// import sampleImage1 from "../../img/logo.png"; // Reemplaza con las rutas de tus imágenes reales
// import sampleImage2 from "../../img/logo.png"; // Reemplaza con las rutas de tus imágenes reales

// export const HomeUserLogued = () => {
//     const { store, actions } = useContext(Context);

//     return (
//         <div style={{ backgroundColor: "white", padding: "20px", minHeight: "100vh" }}>
//             {/* Header Section */}
//             <div className="container mt-5">
//                 <div className="jumbotron text-center p-5 mb-4" style={{ backgroundColor: "#6a0dad", color: "#ffffff", borderRadius: "20px" }}>
//                     <h1 className="display-5 fw-bold">It's time to create your amazing surveys</h1>
//                     <p className="lead">Organize, get insight from your users, and enhance your business decisions.</p>
//                     <Link to="/create_survey" className="btn btn-light btn-lg mt-3" style={{ borderRadius: "20px" }}>Create Survey</Link>
//                 </div>

//                 {/* Active Surveys Section */}
//                 <section>
//                     <h2 className="mb-4" style={{ color: "#333333" }}>Your active surveys:</h2>
//                     <div className="row">
//                         {[{ img: sampleImage1, title: "Is the best project?", responses: "40/100" }, 
//                           { img: sampleImage2, title: "Best places in Canada", responses: "10/100" }]
//                           .map((survey, index) => (
//                             <div key={index} className="col-md-6 mb-4">
//                                 <div className="card shadow-sm border-0" style={{ borderRadius: "20px" }}>
//                                     <img src={survey.img} className="card-img-top" alt={`Survey ${index + 1}`} style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} />
//                                     <div className="card-body">
//                                         <h5 className="card-title">{survey.title}</h5>
//                                         <p className="card-text">A brief description of the survey...</p>
//                                         <span className="badge bg-success mb-2" style={{ borderRadius: "10px" }}>Active</span>
//                                         <div className="d-flex justify-content-between align-items-center mt-3">
//                                             <span>Responses: <strong>{survey.responses}</strong></span>
//                                             <Link to={`/survey/${index}`} className="btn btn-outline-primary btn-sm" style={{ borderRadius: "10px" }}>View details</Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 {/* Popular Surveys Section */}
//                 <section className="mt-5">
//                     <h2 className="mb-4" style={{ color: "#333333" }}>Browse today's most popular surveys</h2>
//                     <div className="row">
//                         {[1, 2, 3, 4].map((survey, index) => (
//                             <div key={index} className="col-md-3 mb-4">
//                                 <div className="card shadow-sm border-0" style={{ borderRadius: "20px" }}>
//                                     <img src={sampleImage1} className="card-img-top" alt={`Popular Survey ${index + 1}`} style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} />
//                                     <div className="card-body">
//                                         <h5 className="card-title">Popular Survey {index + 1}</h5>
//                                         <p className="card-text">A brief description...</p>
//                                         <Link to={`/vote/${index}`} className="btn btn-outline-primary btn-sm" style={{ borderRadius: "10px" }}>Vote now</Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };