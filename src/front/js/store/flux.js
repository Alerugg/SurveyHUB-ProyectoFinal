const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            surveys: [],
            survey: [],
            isAuthenticated: !!localStorage.getItem("jwt-token") // Verifica si hay un token en localStorage al iniciar la app
        },
        actions: {
            // Use getActions to call a function within a function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getSurveys: () => {
                const myHeaders = new Headers();
                myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxOtjA3FE3o-veHrkY87DusxzaXjcwAlygcBr_17AordGZEhDIex3riknLikv2GqeBvHvgpm03Gan6E_1ddhU4e1fUHYwXjKqt6V8lAL3-NI3APfQzfCNVkNH94LlQKW90AOo7X4i7UkHwwGPLLlOVOzIIOShLJ1afit_947CecfaATsTQmDbYiV2-itXXgonSjl7RP_ZrSdqBolp28jgP2s2oHnW8rfQdZMDxNiRKJl-vUhWwZ6Ne_OhGlV3b8pRlcuDM3DWpd6KVUeIwuWjkUPCKKzRWnplyVKhDxm4wjZkfHeI3gqhQughMFF2uBw_Z78loRfMbID2vTmbveCB5bBdBrkk5zgTA7kx19poCFuKJT65qwyAM2oATCc5FYa63Od78UN9YQsidzFmHfF8Cj8pnF_dmGL9gqaKXAb62iRcGOdXv6fITFxPGyysFkD5E6axCcTP3j77iuCCNRcH6-ikWnWMuHm8E3Pga0MT5pzFWQl8Bo-WZOmvY8IXORYckiPnDdAHhSwe41_QThRBRcpfkC4fDQrH-3Tt-1RdCpth2yoQ-woZz9w7keISob8XJArjA9-UxjA6a4rokz0o8g6Di5jbrqfA5R93SsNKz9YAlx2F8xZThnxRay_TNXUHRscZpiO3UqbZm_C4F_beqC-xTfeCgnJjStpCU3Qx4yVlDA0a_riz9Gbdh3Su6qZpy5mP0qlsL2pC7EqRba4epBGfNuN9WyusNgLueTg2-QxFml0NPlBHcDDldcb2RGR8zfxCkftifszAtZ3JwIMD-SnI6EPq8tbvoeIo7tzJrDVHA6KTlf11IEGGex3uFYGUjjYSxF0BgpXdd3yFgMYOUKx-g0KKRw4KtKZZbnzRlwyzc6gEjhl3EjKh8qxcpkEMF4XIPcLe1RCfOyGPkCnCIvfDu_QY920_CqDx_bwwh8tfcML6SLiLaM_ZoC6v2IgpHR0uU3NhROBCR4taqXoOL1p");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };

                fetch(process.env.BACKEND_URL + "/api/surveys", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log("Result from getSurveys: ", result);
                    setStore({ surveys: result });
                })
                .catch((error) => console.error("Error fetching surveys: ", error));
        },

        getSurvey: (id) => {
            const myHeaders = new Headers();
            myHeaders.append(
                "Cookie",
                ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxMgYjc5ouJAvbs4MCmw74Ekyt95Plqt8PcDBJ7oKGv3U3hLTusXCeY9OVgRclTmq34qxdyKC-lKYJnpwCayM8UZFSMhvZra8egft3pSJO5WLk7luzyl2fTqrhBuxfSeSkXpyEwyPW-AHASk607pEQhELRTjpNsATdyxeI6paY6_xwWz-QkxYn0wyl9VyzVO0Q-UyqKsMC2teX62KGvWrsA6pEDgldXMx_E1FKqPV1vaVPdu_l41HTXS-ckI4Byntd0zcVLRQ_52zHa960mXOwzSzTSUthL2uMCmQa25EqMaHTi6JZGOGYia-ZxjOG__CsdXsCCuSVeSuZwEWLZOOOIS6dHJXWhVs9pDB26iBWSNGKWGPYmfQywWHoDp6qJ8eTYP1lJpYu2Fy1ued0zIXYuKWLjdZzxKUeUEruyKR8HJn56d0f5LQvs6R4U9yhR2bzlojBAXKHbSihQcpkHZZJ30elgMH3S3BERTGobztLicdxqpEceHsMGyil0ZQbZ3lqp-T08dxDxLnq3jhxdv_hBLqf10YAoiwSp0wq1L8z5xVDGbO4bgDYBVlf2LsHn3tq5M9IzpHCprKby62ysKZtARvq9YvYzhPxp9hgqfpy1ItqAILSyIp_LVoK2ankcS3wNalluQpP5CjrtoW9kRJwZnSc-Uo8aTwomO6FEGfl-dFt3V5QNi6JKVzKGfbKuKObK0e9rOFLchPuI-SUZ7ojKW2mFrogpSNC2C9afgRPCw8qmxaM9tIB4_T3K_i80MjdYy9Y6o2jMexpHIzXdCXRnWe1HIuidbCN69a9sTS3TTJWZxYrj3EEdItaxNCJcXWJzMIrfvkPGeQU-lNOhCRo5fgLRSrYTpaW6iccCFzR-XcLVoIWm3LA9f38-f7EpwUPC6XKny24RDzF2fUeHuknBTOuFofj6p28bAZ2Za3d2fizBos_CDQXmK5Q1sjo_YFIXomuVUyoZ76qpYLZyqJngu"
            );
        
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };
        
            // Revisar si la URL del backend estÃ¡ definida correctamente
            console.log("Backend URL:", process.env.BACKEND_URL);
            
            fetch(process.env.BACKEND_URL + `/api/surveys/${id}`, requestOptions)
                .then((response) => {
                    console.log("Fetch response:", response); // Verificar la respuesta antes de convertir a JSON
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((result) => {
                    console.log("Fetch result (JSON):", result); // Verificar el resultado convertido a JSON
                    setStore({ survey: result });
                })
                .catch((error) => console.error("Error fetching survey:", error));
        },
        

            login: (data) => {
                localStorage.setItem("jwt-token", data.token);
                setStore({ isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem("jwt-token");
                setStore({ isAuthenticated: false });
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