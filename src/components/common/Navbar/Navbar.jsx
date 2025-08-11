import React, { useState } from 'react';
import './Navbar.css';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h2>Cale-Fin</h2>
          </div>
          <div className="navbar-right">
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button className="register-btn" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </div>
        </div>
      </nav>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}

export default Navbar;
