import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  // Estado para almacenar los gastos que devuelve el backend
  const [expenses, setExpenses] = useState([]);

  // useEffect se ejecuta una sola vez al montar el componente
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/expenses`) // Llamada GET al backend usando variable de entorno
      .then(res => setExpenses(res.data)) // Guardamos los datos en el estado
      .catch(err => console.error(err)); // Manejamos errores por consola
  }, []);

  return (
    <div>
      <h1>Monthly Expenses</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount (S/)</th>
          </tr>
        </thead>
        <tbody>
          {/* Iteramos sobre el array de gastos y renderizamos cada fila */}
          {expenses.map(e => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.type}</td>
              <td>S/ {parseFloat(e.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
