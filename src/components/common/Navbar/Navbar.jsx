import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';
import { useAuth } from '../../../context/AuthContext';

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    }
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">Cale-Fin</Link>
          </div>
          <div className="navbar-right">
            {user ? (
              <div className="user-section">
                <span className="user-name">Hola, {user.nombre || user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
                <button className="register-btn" onClick={() => setShowRegister(true)}>Register</button>
              </>
            )}
          </div>
        </div>
      </nav>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}

export default Navbar;
