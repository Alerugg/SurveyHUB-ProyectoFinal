import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <Auth0Provider
      domain="TU_DOMAIN"
      clientId="TU_CLIENT_ID"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <BrowserRouter>
        {/* Aquí va el resto de tu aplicación */}
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;