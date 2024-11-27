// App.js
import React from 'react';
import Auth0ProviderWrapper from './Auth0Provider';  // El wrapper de Auth0
import injectContext from './appContext';  // El contexto global de la app
import LoginWithAuth0 from './LoginWithAuth0';  // El componente de login con Auth0

// Envolvemos la app con el proveedor de Auth0 y el contexto
const App = () => {
  return (
    <Auth0ProviderWrapper>
      <injectContext>
        <div>
          <h1>Mi Aplicación con Auth0</h1>
          <LoginWithAuth0 />  {/* El componente de login de Auth0 */}
        </div>
      </injectContext>
    </Auth0ProviderWrapper>
  );
};

export default App;
