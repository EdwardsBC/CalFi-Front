import { useState, useEffect } from "react";
import "./Home.css";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Home() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [calendar, setCalendar] = useState([]);

  // Datos de prueba: { dia: número, pasajes: monto, extras: monto }
  const dummyData = [
    { day: 1, pasajes: 3.5, extras: 0 },
    { day: 5, pasajes: 3.5, extras: 10 },
    { day: 10, pasajes: 3.5, extras: 2 },
    { day: 15, pasajes: 3.5, extras: 0 },
    { day: 20, pasajes: 3.5, extras: 5 },
  ];

  useEffect(() => {
    generateCalendar(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let weeks = [];
    let currentWeek = Array(7).fill(null);

    // Rellenar días vacíos antes del primer día
    let dayOfWeek = firstDay.getDay(); // 0=Domingo
    if (dayOfWeek === 0) dayOfWeek = 7; // Ajuste para iniciar en lunes
    for (let i = 0; i < dayOfWeek - 1; i++) {
      currentWeek[i] = null;
    }

    // Llenar los días
    for (let day = 1; day <= lastDay.getDate(); day++) {
      let currentDate = new Date(year, month, day);
      let weekDay = currentDate.getDay();
      if (weekDay === 0) weekDay = 7; // Ajuste lunes=1, domingo=7

      currentWeek[weekDay - 1] = {
        day,
        pasajes: dummyData.find(d => d.day === day)?.pasajes || 0,
        extras: dummyData.find(d => d.day === day)?.extras || 0
      };

      // Si es domingo, empujamos la semana y reiniciamos
      if (weekDay === 7 || day === lastDay.getDate()) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    }

    setCalendar(weeks);
  }

  return (
    <div className="home-container">
      <h1>Calendario Financiero</h1>

      <div className="controls">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((m, idx) => (
            <option key={idx} value={idx}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{ width: "80px" }}
        />
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            <th>Lun</th>
            <th>Mar</th>
            <th>Mié</th>
            <th>Jue</th>
            <th>Vie</th>
            <th>Sáb</th>
            <th>Dom</th>
          </tr>
        </thead>
        <tbody>
          {calendar.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <td key={di}>
                  {day ? (
                    <>
                      <div className="day-number">{day.day}</div>
                      <div className="cell-data">Pasajes: {day.pasajes}</div>
                      <div className="cell-data">Extras: {day.extras}</div>
                    </>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
