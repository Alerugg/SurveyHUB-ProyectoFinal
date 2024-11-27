import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const CallbackPage = () => {
  const { handleRedirectCallback, isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    console.log("Iniciando el manejo del callback...");
    handleRedirectCallback()
      .then(() => {
        console.log("Redirección manejada correctamente");
      })
      .catch((err) => {
        console.error("Error al manejar la redirección:", err);
      });
  }, [handleRedirectCallback]);

  if (isLoading) {
    console.log("Auth0 está cargando...");
    return <div>Cargando...</div>;
  }

  if (error) {
    console.error("Error de autenticación:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <h1>Bienvenido</h1>
      ) : (
        <h1>Error al autenticar</h1>
      )}
    </div>
  );
};

export default CallbackPage;
