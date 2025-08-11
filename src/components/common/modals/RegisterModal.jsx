// Ruta: src/components/RegisterModal.jsx

// Importamos React y el hook useState para manejar el estado del formulario
import React, { useState } from 'react';
// Importamos estilos generales del modal
import './Modal.css';
// Importamos axios para hacer peticiones HTTP
import axios from 'axios';

const RegisterModal = ({ onClose }) => {
  // Estado para el nombre de usuario
  const [username, setUsername] = useState('');
  // Estado para el correo
  const [email, setEmail] = useState('');
  // Estado para la contraseña
  const [password, setPassword] = useState('');
  // Estado para confirmar la contraseña
  const [confirmPassword, setConfirmPassword] = useState('');
  // Estado para el código de verificación (segunda etapa)
  const [verificationCode, setVerificationCode] = useState('');
  // Estado para controlar el flujo: "register" o "verify"
  const [step, setStep] = useState('register');
  // Estado para mostrar mensajes de validación o éxito/error
  const [message, setMessage] = useState('');

  /**
   * Maneja el registro de usuario
   * 1. Previene el submit por defecto
   * 2. Valida que las contraseñas coincidan
   * 3. Envía los datos al backend para registrar
   * 4. Si el registro es exitoso, cambia a la etapa de verificación
   */
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
        setMessage(`❌ ${res.data.error || 'Error al registrar.'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error en el servidor. Intenta más tarde.');
    }
  };

  /**
   * Maneja la verificación del código enviado al correo
   * 1. Envía el correo y código al backend
   * 2. Si es correcto, muestra mensaje y redirige
   */
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
          window.location.href = '/schedule'; // Redirección tras éxito
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
        {/* Botón de cierre del modal */}
        <button className="close-button" onClick={onClose}>X</button>

        {/* Si estamos en paso de registro */}
        {step === 'register' ? (
          <>
            <h2>Crear cuenta</h2>
            <form onSubmit={handleRegister}>
              {/* Campo nombre */}
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              {/* Campo correo */}
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Campo contraseña */}
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Campo confirmar contraseña */}
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
          /* Si estamos en paso de verificación */
          <>
            <h2>Verifica tu correo</h2>
            <p>Introduce el código enviado a <b>{email}</b></p>
            <form onSubmit={handleVerify}>
              {/* Campo código de verificación */}
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

        {/* Mensaje de estado */}
        {message && <p className="modal-message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterModal;
