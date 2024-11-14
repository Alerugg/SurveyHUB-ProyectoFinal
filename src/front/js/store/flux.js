const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            surveys: [],
            survey: null,
            user: null,
            isAuthenticated: !!localStorage.getItem("jwt-token")
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
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
                    console.log("Result from getSurveys: ", result);
                    setStore({ surveys: result });
                } catch (error) {
                    console.error("Error fetching surveys: ", error);
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

                    const result = await response.json();
                    console.log("Fetch result (JSON):", result);
                    setStore({ survey: result });
                } catch (error) {
                    console.error("Error fetching survey:", error);
                }
            },

            getUserSurveys: async () => {
                const store = getStore();
                if (!store.user || !store.user.id) {
                    console.error("User not found in store.");
                    return;
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.user.id}`, {
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
                        const surveyIds = result.surveys.map(survey => survey.id);
                        const surveys = await Promise.all(surveyIds.map(id => getActions().getSurveyById(id)));
                        setStore({ surveys });
                    } else {
                        console.error("No surveys found for user.");
                    }
                } catch (error) {
                    console.error("Error fetching user surveys: ", error);
                }
            },

            getSurveyById: async (id) => {
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

                    return await response.json();
                } catch (error) {
                    console.error("Error fetching survey by ID:", error);
                    return null;
                }
            },

            login: (data) => {
                localStorage.setItem("jwt-token", data.token);
                setStore({ isAuthenticated: true });

                try {
                    const decodedToken = jwt_decode(data.token);
                    setStore({ user: { id: decodedToken.user_id } });
                } catch (error) {
                    console.error("Error decoding token: ", error);
                }
            },

            logout: () => {
                localStorage.removeItem("jwt-token");
                setStore({ isAuthenticated: false, user: null, surveys: [], survey: null });
            },

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;