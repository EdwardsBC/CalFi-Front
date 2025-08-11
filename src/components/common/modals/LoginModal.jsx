// Ruta del archivo: /src/components/LoginModal.jsx

// Importa React y el hook useState para manejar estados locales en el componente
import React, { useState } from 'react';

// Importa los estilos CSS específicos para este modal
import './Modal.css';

// Importa Axios para realizar peticiones HTTP al backend
import axios from 'axios';

/**
 * Componente funcional LoginModal
 * Recibe como prop `onClose` una función para cerrar el modal.
 */
function LoginModal({ onClose }) {
  // Estado para almacenar el correo ingresado por el usuario
  const [correo, setCorreo] = useState('');

  // Estado para almacenar la contraseña ingresada por el usuario
  const [password, setPassword] = useState('');

  // Estado para mostrar mensajes de error o confirmación al usuario
  const [mensaje, setMensaje] = useState('');

  /**
   * Función asincrónica que maneja el inicio de sesión
   * @param {Event} e - Evento de envío del formulario
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    try {
      // Realiza la petición POST al backend usando la URL definida en variables de entorno
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`, // URL del endpoint de login
        {
          correo,   // Envia el correo ingresado
          password, // Envia la contraseña ingresada
        }
      );

      // Si la autenticación es exitosa
      if (response.data.success) {
        // Guarda el token JWT en el localStorage para su uso posterior en otras peticiones
        localStorage.setItem('token', response.data.token);

        // Muestra un mensaje de éxito
        setMensaje('Inicio de sesión exitoso.');

        // Cierra el modal
        onClose();

        // Aquí se podría implementar redirección o actualización de estado global (ej. context/redux)
      } else {
        // Si el backend devuelve un mensaje de error, lo mostramos
        setMensaje(response.data.message);
      }
    } catch (error) {
      // Manejo de errores: muestra mensaje del backend o un mensaje genérico
      setMensaje(error.response?.data?.message || 'Error al iniciar sesión.');
    }
  };

  return (
    // Contenedor que oscurece el fondo al abrir el modal
    <div className="modal-overlay">
      {/* Contenedor principal del modal */}
      <div className="modal">
        
        {/* Botón para cerrar el modal */}
        <button className="close-button" onClick={onClose}>X</button>
        
        {/* Título del modal */}
        <h2>Iniciar sesión</h2>

        {/* Formulario para iniciar sesión */}
        <form onSubmit={handleLogin}>
          
          {/* Campo de entrada para el correo */}
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)} // Actualiza el estado del correo
            required
          />

          {/* Campo de entrada para la contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
            required
          />

          {/* Botón para enviar el formulario */}
          <button type="submit">Login</button>
        </form>

        {/* Mensaje de error o éxito */}
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}

// Exporta el componente para que pueda ser utilizado en otras partes de la app
export default LoginModal;
