// src/components/common/CalendarTable/CalendarTable.jsx
import { useEffect, useState } from "react";
import "./CalendarTable.css";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function CalendarTable({
  data,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onDayDoubleClick
}) {
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    generateCalendar(selectedMonth, selectedYear);
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear, data]);

  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let weeks = [];
    let currentWeek = Array(7).fill(null);
    let dayOfWeek = firstDay.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    for (let i = 0; i < dayOfWeek - 1; i++) {
      currentWeek[i] = null;
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      let currentDate = new Date(year, month, day);
      let weekDay = currentDate.getDay();
      if (weekDay === 0) weekDay = 7;

      const foundData = data.find(d => d.day === day);

      currentWeek[weekDay - 1] = {
        day,
        pasajes: foundData?.pasajes || 0,
        extras: foundData?.extras || 0,
        fijo: foundData?.fijo || false
      };

      if (weekDay === 7 || day === lastDay.getDate()) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    }

    setCalendar(weeks);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendario Financiero</h2>
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
            style={{ width: "100px", marginLeft: "8px" }}
          />
        </div>
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
                <td
                  key={di}
                  onDoubleClick={() => onDayDoubleClick(day)}
                  className={day && day.fijo ? "cell-fijo" : ""}
                >
                  {day ? (
                    <>
                      <div className="day-number">{day.day}</div>
                      <div className="cell-data">Pasajes: {day.pasajes}</div>
                      <div className="cell-data">Extras: {day.extras}</div>
                      {day.fijo && <div className="fijo-label">Fijo</div>}
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
