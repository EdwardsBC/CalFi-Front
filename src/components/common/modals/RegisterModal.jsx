
import React, { useState } from 'react';
import './Modal.css';
import axios from 'axios';

const RegisterModal = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('register');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        nombre: username,
        correo: email,
        password: password
      });
      console.log(res);

      if (res.data.success) {
        setStep('verify');
        setMessage('✅ Código enviado al correo. Revisa tu bandeja de entrada.');
      } else {
        setMessage(`❌ ${res.data.message || 'Error al registrar.'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage(`❌ ${error.response?.data?.message || 'Error en el servidor. Intenta más tarde.'}`);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        correo: email,
        codigo: verificationCode
      });

      if (res.data.success) {
        setMessage('✅ Registro completo. Redirigiendo...');
        setTimeout(() => {
          window.location.href = '/schedule'; 
        }, 2000);
      } else {
        setMessage(`❌ ${res.data.error || 'Código incorrecto'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error al verificar el código.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        {step === 'register' ? (
          <>
            <h2>Crear cuenta</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit">Registrar</button>
            </form>
          </>
        ) : (
          <>
            <h2>Verifica tu correo</h2>
            <p>Introduce el código enviado a <b>{email}</b></p>
            <form onSubmit={handleVerify}>
              <input
                type="text"
                placeholder="Código de verificación"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <button type="submit">Validar código</button>
            </form>
          </>
        )}

        {message && <p className="modal-message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterModal;
