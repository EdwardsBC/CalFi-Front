import React, { useState } from 'react';
import './Modal.css';
import axios from 'axios';

function LoginModal({ onClose }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          correo,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);

        setMensaje('Inicio de sesión exitoso.');

        onClose();

      } else {
        setMensaje(response.data.message);
      }
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        
        <button className="close-button" onClick={onClose}>X</button>
        
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}
export default LoginModal;
