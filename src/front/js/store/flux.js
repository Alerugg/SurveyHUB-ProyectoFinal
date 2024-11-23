const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            surveys: [],
            survey: null,
            user: null,
            isAuthenticated: !!localStorage.getItem("jwt-token"),
            userVotedSurveys: null
        },
        actions: {
            // Función para obtener el perfil del usuario actual
            getUserProfile: async () => {
                const token = localStorage.getItem("jwt-token");
                if (!token) return;

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/me`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorResponse = await response.json();
                        console.error("Detalles del error: ", errorResponse);
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.message}`);
                    }

                    const result = await response.json();
                    setStore({ user: result, isAuthenticated: true });
                } catch (error) {
                    console.error("Error fetching user profile: ", error);
                    setStore({ isAuthenticated: false, user: null });
                }
            },

            getSurveys: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/surveys`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    setStore({ surveys: result });
                } catch (error) {
                    console.error("Error fetching surveys: ", error);
                }
            },

            getUserVotedSurveys: async (userId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/votes/surveys`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    setStore({ userVotedSurveys: result });
                } catch (error) {
                    console.error("Error fetching user voted surveys: ", error);
                }
            },



            getUserSurveys: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/me`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.surveys) {
                        setStore({ surveys: result.surveys });
                    } else {
                        console.error("No surveys found for user.");
                    }
                } catch (error) {
                    console.error("Error fetching user surveys: ", error);
                }
            },

            getSurvey: async (id) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/surveys/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const survey = await response.json();
                    setStore({ survey });
                } catch (error) {
                    console.error("Error fetching survey by ID:", error);
                }
            },

            login: async (data) => {
                localStorage.setItem("jwt-token", data.token);
                setStore({ isAuthenticated: true });
                await getActions().getUserProfile(); // Obtener el perfil completo del usuario después del login
            },


            logout: () => {
                localStorage.removeItem("jwt-token");
                localStorage.removeItem("user_id");
                setStore({
                    isAuthenticated: false,
                    user: null,
                    surveys: [],
                    survey: null,
                });
                window.location.href = "/"; // Redirige a la página principal después del logout
            },

            updateUserProfile: async (updatedUser) => {
                const token = localStorage.getItem("jwt-token");
                if (!token) {
                    alert("No se encontró el token de autenticación.");
                    return false;
                }

                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/user/profile", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(updatedUser),
                    });

                    if (!response.ok) {
                        throw new Error("Error al actualizar el perfil del usuario.");
                    }

                    const data = await response.json();
                    // Actualizamos el store con la nueva información del usuario
                    setStore({ user: data });
                    return true;
                } catch (error) {
                    console.error("Error actualizando el perfil:", error);
                    return false;
                }
            },

            // flux.js

            updateUserPassword: async ({ new_password }) => {
                const token = localStorage.getItem("jwt-token");
            
                if (!token) {
                    console.error("No se encontró un token de autenticación");
                    alert("Error: No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.");
                    return false;
                }
            
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/user/update-password", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ new_password })
                    });
            
                    if (response.ok) {
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error al realizar la solicitud:", errorData);
                        alert("Hubo un error al actualizar la contraseña. Por favor, inténtalo de nuevo.");
                        return false;
                    }
                } catch (error) {
                    console.error("Error al realizar la solicitud:", error);
                    return false;
                }
            },
            
            






            // Función para verificar si el usuario está autenticado al cargar la aplicación
            checkAuth: async () => {
                const token = localStorage.getItem("jwt-token");
                if (token) {
                    await getActions().getUserProfile();
                }
            },

            updateSurveyStatus: async (surveyId, newStatus) => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    if (!token) {
                        throw new Error("User not logged in");
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/surveys/${surveyId}/status`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: newStatus })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Response error:", errorText);
                        throw new Error("Failed to update survey status");
                    }

                    // Actualiza el estado en el store con la nueva información de la encuesta
                    const updatedSurvey = await response.json();
                    setStore({
                        ...getStore(),
                        surveys: getStore().surveys.map(survey =>
                            survey.id === updatedSurvey.id ? { ...survey, status: newStatus } : survey
                        ),
                        survey: { ...getStore().survey, status: newStatus }
                    });
                } catch (error) {
                    console.error("Error updating survey status:", error);
                }
            },
        }
    };
};

export default getState;
