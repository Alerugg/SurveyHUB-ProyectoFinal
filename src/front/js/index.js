import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar createRoot
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from "react-router-dom";
import Login from './pages/login.js'; // Asegúrate de que la ruta sea correcta

// Obtener el contenedor principal donde se montará la app
const rootElement = document.getElementById('app'); // Cambiado root por app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-pc4ip6ajno471us8.eu.auth0.com"
      clientId="4GEmDYtNKQSRvu8H3yQNbumneMDQXCQV"
      authorizationParams={{
        redirect_uri: "http://localhost:3000",
      }}
    >
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
