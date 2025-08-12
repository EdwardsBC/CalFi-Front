import React, { useState, useEffect } from 'react';
import './Navbar.css';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h2>Cale-Fin</h2>
          </div>
          <div className="navbar-right">
            {user ? (
              <div className="user-section">
                <span className="user-name">Hola, {user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <button className="login-btn" onClick={() => setShowLogin(true)}>
                  Login
                </button>
                <button className="register-btn" onClick={() => setShowRegister(true)}>
                  Register
                </button>
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
