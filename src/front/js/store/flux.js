const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            surveys: [],
            survey: null,
            user: null,
            isAuthenticated: !!localStorage.getItem("jwt-token"),
            userVotedSurveys: null,
            auth0User: null,
        },
        actions: {
            // Función para obtener el perfil del usuario actual
            getUserProfile: async () => {
                const token = localStorage.getItem("jwt-token");
                console.log("Obteniendo perfil de usuario. Token existe:", !!token);
                
                if (!token) {
                    console.log("No hay token disponible, saliendo de getUserProfile");
                    setStore({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    console.log("Haciendo petición al backend para obtener perfil...");
                    const response = await fetch(`${process.env.BACKEND_URL}/api/me`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        const errorResponse = await response.json();
                        console.error("Error en respuesta del servidor:", {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorResponse
                        });
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log("Perfil de usuario obtenido:", result);
                    setStore({ user: result, isAuthenticated: true });
                } catch (error) {
                    console.error("Error en getUserProfile:", {
                        message: error.message,
                        stack: error.stack
                    });
                    setStore({ isAuthenticated: false, user: null });
                }
            },

            // Manejo del login con Auth0
            handleAuth0Login: async (auth0User) => {
                console.group('Auth0 Login Debug');
                try {
                    console.log("1. Usuario Auth0 recibido:", {
                        email: auth0User.email,
                        nickname: auth0User.nickname,
                        sub: auth0User.sub,
                        name: auth0User.name,
                        picture: auth0User.picture
                    });
            
                    setStore({ isAuthenticated: true, user: data });

                    const userData = {
                        email: auth0User.email || `${auth0User.nickname}@gmail.com`,
                        full_name: auth0User.name || auth0User.nickname,
                        auth0_id: auth0User.sub,
                        picture: auth0User.picture || null
                    };
            
                    console.log("2. Datos preparados para enviar:", userData);
                    console.log("3. URL del backend:", process.env.BACKEND_URL);
                    
                    const response = await fetch(`${process.env.BACKEND_URL}/api/auth0-sync`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userData),
                    });
            
                    console.log("4. Respuesta recibida:", {
                        ok: response.ok,
                        status: response.status,
                        statusText: response.statusText
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("5. Error en respuesta del servidor:", {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData
                        });
                        throw new Error(errorData.message || "Error synchronizing with backend");
                    }
            
                    const data = await response.json();
                    console.log("6. Sincronización exitosa. Datos recibidos:", data);
            
                    localStorage.setItem("jwt-token", data.token);
                    console.log("7. Token guardado en localStorage");

                    setStore({ 
                        user: data, 
                        isAuthenticated: true, 
                        auth0User 
                    });
                    console.log("8. Estado global actualizado");
            
                    return data;
                } catch (error) {
                    console.error("9. Error en handleAuth0Login:", {
                        message: error.message,
                        stack: error.stack
                    });
                    setStore({ isAuthenticated: false, user: null });
                    throw error;
                } finally {
                    console.groupEnd();
                }
            },

            getSurveys: async () => {
                console.log("Iniciando obtención de encuestas...");
                try {
                    const token = localStorage.getItem("jwt-token");
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    const response = await fetch(`${process.env.BACKEND_URL}/api/surveys`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Error obteniendo encuestas:", {
                            status: response.status,
                            statusText: response.statusText
                        });
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log("Encuestas obtenidas:", result);
                    setStore({ surveys: result });
                } catch (error) {
                    console.error("Error en getSurveys:", {
                        message: error.message,
                        stack: error.stack
                    });
                }
            },

            getUserVotedSurveys: async (userId) => {
                console.log("Obteniendo encuestas votadas para usuario:", userId);
                const token = localStorage.getItem("jwt-token");
                if (!token) {
                    console.error("Token not found");
                    setStore({ userVotedSurveys: [] });
                    return [];
                }
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/votes/surveys`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Error obteniendo votos:", {
                            status: response.status,
                            statusText: response.statusText
                        });
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log("Votos obtenidos:", result);
                    setStore({ userVotedSurveys: result });
                    return result;
                } catch (error) {
                    console.error("Error en getUserVotedSurveys:", {
                        message: error.message,
                        stack: error.stack
                    });
                    setStore({ userVotedSurveys: [] });
                    return [];
                }
            },

            getSurvey: async (id) => {
                console.log("Obteniendo encuesta específica. ID:", id);
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/surveys/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Error obteniendo encuesta:", {
                            status: response.status,
                            statusText: response.statusText
                        });
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const survey = await response.json();
                    console.log("Encuesta obtenida:", survey);
                    setStore({ survey });
                } catch (error) {
                    console.error("Error en getSurvey:", {
                        message: error.message,
                        stack: error.stack
                    });
                }
            },

            getUserSurveys: async (userId) => {
                console.log("Obteniendo encuestas del usuario. ID de usuario:", userId);
                const token = localStorage.getItem("jwt-token");
                if (!token || !userId) {
                    console.error("Token o ID de usuario no encontrados");
                    return;
                }
                
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/surveys`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    if (result.surveys) {
                        setStore({ surveys: result.surveys });
                    } else {
                        console.error("No se encontraron encuestas para el usuario.");
                    }
                } catch (error) {
                    console.error("Error obteniendo encuestas del usuario: ", error);
                }
            },

            login: async (data) => {
                console.log("Iniciando proceso de login manual");
                console.log(data)
                localStorage.setItem("jwt-token", data.token);
                console.log("Token guardado en localStorage");
                setStore({ isAuthenticated: true, user: data });
                console.log("Estado actualizado con datos de usuario");
                await getActions().getUserProfile();
                console.log("Perfil de usuario actualizado después de login manual");

            },

            logout: ({ logout: auth0Logout } = {}) => {
                console.log("Iniciando proceso de logout");
                localStorage.removeItem("jwt-token");
                console.log("Token removido de localStorage");
                
                setStore({
                    isAuthenticated: false,
                    user: null,
                    auth0User: null,
                    surveys: [],
                    survey: null,
                });
                console.log("Estado global reseteado");

                if (auth0Logout) {
                    console.log("Ejecutando logout de Auth0");
                    auth0Logout();
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem("jwt-token");
                console.log("Verificando autenticación. Token existe:", !!token);
                
                if (token) {
                    console.log("Token encontrado, validando perfil...");
                    await getActions().getUserProfile();
                } else {
                    console.log("No hay token, el usuario no está autenticado");
                    setStore({ isAuthenticated: false, user: null });
                }
            },

            updateSurveyStatus: async (surveyId, newStatus) => {
                console.log("Actualizando estado de encuesta:", { surveyId, newStatus });
                try {
                    const token = localStorage.getItem("jwt-token");
                    if (!token) {
                        console.error("No hay token disponible");
                        throw new Error("User not logged in");
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/surveys/${surveyId}/status`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: newStatus }),
                    });

                    if (!response.ok) {
                        console.error("Error actualizando estado:", {
                            status: response.status,
                            statusText: response.statusText
                        });
                        throw new Error("Failed to update survey status");
                    }

                    const updatedSurvey = await response.json();
                    console.log("Encuesta actualizada:", updatedSurvey);
                    
                    const currentStore = getStore();
                    setStore({
                        ...currentStore,
                        surveys: currentStore.surveys.map((survey) =>
                            survey.id === updatedSurvey.id ? { ...survey, status: newStatus } : survey
                        ),
                        survey: { ...currentStore.survey, status: newStatus },
                    });
                    console.log("Estado global actualizado con nueva información de la encuesta");
                } catch (error) {
                    console.error("Error en updateSurveyStatus:", {
                        message: error.message,
                        stack: error.stack
                    });
                }
            },
        },
    };
};

export default getState;
