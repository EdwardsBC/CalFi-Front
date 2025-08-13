import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // ⬅ Importa el router
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ⬅ Envuelve toda tu app en el router */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
