import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Callback = () => {
  const { isAuthenticated, user, loginWithRedirect, handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth0Redirect = async () => {
      try {
        await handleRedirectCallback();  // Maneja la respuesta de Auth0
        if (isAuthenticated) {
          navigate("/user_logued");  // Redirige a la página de usuario logueado
        }
      } catch (error) {
        console.error(error);
        navigate("/login");  // Si hay error, redirige a login
      }
    };

    handleAuth0Redirect();
  }, [handleRedirectCallback, isAuthenticated, navigate]);

  return <div>Loading...</div>; // Mostrar un loading mientras se maneja la redirección
};

export default Callback;
