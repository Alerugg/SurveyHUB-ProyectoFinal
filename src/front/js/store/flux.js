const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            // Use getActions to call a function within a function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello", {
                        mode: 'cors' // Habilita el modo CORS
                    });
        
                    if (!resp.ok) {
                        throw new Error(`HTTP error! Status: ${resp.status}`);
                    }
        
                    const data = await resp.json();
                    setStore({ message: data.message });
                    
                    // don't forget to return something, that is how the async resolves
                    return data;
                } catch (error) {
                    console.error("Error loading message from backend", error);
                    alert("An error occurred while trying to fetch the data. Please check your connection and try again.");
                }
            },

            changeColor: (index, color) => {
                // Get the store
                const store = getStore();

                // Loop through the demo array to change the color of the element at the given index
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

                // Reset the global store
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;
