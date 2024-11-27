import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';
import "../styles/index.css";
import Layout from "./layout";

const rootElement = document.querySelector("#app");

if (rootElement) {
  const root = createRoot(rootElement);
  
  // Configuración de Auth0
  const domain = "dev-qn1i850gfvm5fcb4.eu.auth0.com";
  const clientId = "bRwmolpIAK0bcStqT8FgarzflpIAevHk";
  const currentOrigin = window.location.origin;
  const redirectUri = `${currentOrigin}/user_logued`;
  const audience = "https://dev-qn1i850gfvm5fcb4.eu.auth0.com/api/v2/";

  const onRedirectCallback = (appState) => {
    console.group("Auth0 Redirect Callback");
    console.log("Estado recibido:", appState);
    console.log("URL actual:", window.location.href);
    
    // Limpiar la URL de parámetros de autenticación
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    const finalRedirectUrl = appState?.returnTo || '/user_logued';
    console.log("Redirigiendo a:", finalRedirectUrl);
    console.groupEnd();

    window.location.replace(finalRedirectUrl);
  };

  root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email",
        audience: audience
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      <Layout />
    </Auth0Provider>
  );
}