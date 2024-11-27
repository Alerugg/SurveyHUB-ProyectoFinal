// Auth0ProviderWrapper.js
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWrapper = ({ children }) => {
  const domain = "dev-qn1i850gfvm5fcb4.eu.auth0.com";  // Reemplaza con tu dominio de Auth0
  const clientId = "bRwmolpIAK0bcStqT8FgarzflpIAevHk";  // Reemplaza con tu Client ID

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={"https://sturdy-xylophone-r4r7qrjrvj49f5w7p-3000.app.github.dev/"} // Redirige a la página actual después de la autenticación
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWrapper;
