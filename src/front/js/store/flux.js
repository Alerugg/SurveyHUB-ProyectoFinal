const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            surveys: [],
        },
        actions: {
            // Use getActions to call a function within a function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getSurveys: () => {

                const myHeaders = new Headers();
                myHeaders.append("Cookie", ".Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxPrL2MXILcgqc6FNtrG8Xp_FQLZ6QQtDO61I-eGxsDzGoHNmGok2DHAc335tSfRI56vB3XVqKhiFC01iJ9DXC2q3Ng2FfRLsz17qzuNLx9h4y0RNTAdxbHNTTu8Fs2WCbtHjyXfuFuGsNl1m_E_tJfFDzMvVIRTy6oFMbTMElgrjYsQkYUDEvJIhxjxgSsqfAXkmE4omS9DPuF-HUmZBsVE4terLC24e5R-288UZkMqMPCOWUtugzOTIs-BvuYpeUrxiBd_zlcb2mFaABTYSaWlwieww7ibOogOyJj2a66TjvWCNObmk6x4BmP7P2J0MSFvacN4Fh_esfiaRacwnrW3HULBl8iHaK9NQ_LlsCRZZWbyUOYKBS0ngMjzZnEW1fqXPAd-ystF9NFdAXGwodKsY2eDaowAXvYLU7TIXnffmi7G-aYrktBsndvL8Tnk9hzIQcLUeeJFjZvyqzaQOICOA1qVYsIge0IGzf2z4VK_lQli8vC0-IAevUELMcVEUGnh6bwAZOlfuemq935MJDnvqPhIn7qQogjBQdaUbxakcGjx52lw2ZD5ai6VvqU709nCGrJ35rJ01xjn9pnbssrDlpcE1HFjB2M8fKHhPyGh3Fe4EzBYxqTmD27143hr9JzYMYltRmyQcsrrqbXReFkLi1WuXzM69-LuEZ6obgGb6IQgQNCBIpLghR-99rt42RQqzizRJVvhFeYVyCCQKWY8999TnNw7MvA0iIMRACW-DO2VCrsOOZ9er1zM_nl--ty8okPS6wk1q9YQ-5jWDkGkuLjUG6YtnFPMP4Imwo9A1Dus38_i63mShMLOSIbBXSLoTKdf3GQXzZHW94-D99yExU5Erkc7GtwKtliRLTywYg4dxucnZtS951BobsGUyrkT5nSiiUrd7yQgMGDf_iS3G29k2NFWNIeRaYkSaTwY04QSUn-uxFiM58bJstTlW67JrKQdydKlZr0xNeoKiDR1");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };

                fetch("https://glowing-space-fortnight-vx74pxvwgr5h74q-3001.app.github.dev/api/surveys", requestOptions)
                    .then((response) => response.json())
                    .then((result) => setStore({surveys : result}))
                    .catch((error) => console.error(error));

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
