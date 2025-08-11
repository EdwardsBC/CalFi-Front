// Ruta: src/components/Navbar.jsx

// Importamos React y el hook useState para manejar el estado de los modales
import React, { useState } from 'react';
// Importamos los estilos de la barra de navegación
import './Navbar.css';
// Importamos los componentes modales de login y registro
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

function Navbar() {
  // Estado para controlar la visibilidad del modal de login
  const [showLogin, setShowLogin] = useState(false);
  // Estado para controlar la visibilidad del modal de registro
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {/* Barra de navegación principal */}
      <nav className="navbar">
        <div className="navbar-content">
          {/* Lado izquierdo: título o logo */}
          <div className="navbar-left">
            <h2>Cale-Fin</h2>
          </div>

          {/* Lado derecho: botones de acción */}
          <div className="navbar-right">
            {/* Botón para abrir modal de login */}
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>

            {/* Botón para abrir modal de registro */}
            <button className="register-btn" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Renderizado condicional de los modales */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}

export default Navbar;
