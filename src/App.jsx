import './App.css';
import Navbar from './components/common/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        {user ? (
          <Home />
        ) : (
          <>
            <h1>Bienvenid@ a Cale-Fin</h1>
            <p>Tu calendario financiero personal!</p>
          </>
        )}
      </div>
    </>
  );
}

export default App;
