import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/expenses`)
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
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
