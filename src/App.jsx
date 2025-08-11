import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      {/* Navbar fijo en la parte superior */}
      <Navbar />
      {/* Contenido principal de la página */}
      <div style={{ padding: '2rem' }}>
        <h1>Bienvenid@ a Cale-Fin</h1>
        <p>Tu calendario financiero personal!</p>
      </div>
    </>
  );
}

export default App;
