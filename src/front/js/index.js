// Importa React y createRoot
import React from "react";
import { createRoot } from "react-dom/client";

// Incluye tu archivo de estilos
import "../styles/index.css";

// Importa tus propios componentes
import Layout from "./layout";

// Obtén el elemento raíz
const rootElement = document.querySelector("#app");

// Crea el root usando createRoot y renderiza la aplicación
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Layout />
    </React.StrictMode>
  );
}
