// src/pages/Home/Home.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import CalendarTable from "../../components/common/CalendarTable/CalendarTable";
import "./Home.css";

export default function Home() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-based
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editType, setEditType] = useState("extras");
  const [editFijo, setEditFijo] = useState(false);

  const [data, setData] = useState([]); // ahora poblado desde la API

  const [resumen, setResumen] = useState({
    ingresos: [
      { nombre: "Sueldo", valor: 0, fijo: true },
      { nombre: "Extras", valor: 0, fijo: false }
    ],
    egresos: [
      { nombre: "Pasajes", valor: 0, fijo: true },
      { nombre: "Internet", valor: 0, fijo: true },
      { nombre: "Extras", valor: 0, fijo: false }
    ],
    ahorros: [
      { nombre: "Ahorros", valor: 0 }
    ]
  });

  const [editResumen, setEditResumen] = useState(null);

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
  });

  // Interceptor para poner token automáticamente (si existe)
  API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // cargar entradas del calendario para mes/año seleccionado
  useEffect(() => {
    fetchCalendarEntries();
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear]);

  async function fetchCalendarEntries() {
    try {
      const res = await API.get('/calendar', {
        params: { month: selectedMonth + 1, year: selectedYear } // DB guarda month 1-12
      });
      if (res.data && res.data.success) {
        // res.data.entries -> array {id, day, month, year, pasajes, extras, fijo}
        // convertimos a formato que usa CalendarTable/Home (day, pasajes, extras, fijo, id)
        const entries = res.data.entries.map(e => ({
          id: e.id,
          day: e.day,
          pasajes: Number(e.pasajes),
          extras: Number(e.extras),
          fijo: !!e.fijo
        }));
        setData(entries);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching calendar entries:', error);
      setData([]);
    }
  }

  // Actualiza el resumen dinámicamente (suma extras/pasajes provenientes de data)
  useEffect(() => {
    let ingresosExtras = 0;
    let egresosPasajes = 0;
    data.forEach(d => {
      if (d.extras) ingresosExtras += d.extras;
      if (d.pasajes) egresosPasajes += d.pasajes;
    });

    setResumen(prev => ({
      ...prev,
      ingresos: prev.ingresos.map(item =>
        item.nombre === "Extras" ? { ...item, valor: ingresosExtras } : item
      ),
      egresos: prev.egresos.map(item =>
        item.nombre === "Pasajes" ? { ...item, valor: egresosPasajes } : item
      )
    }));
  }, [data]);

  // Evento desde CalendarTable (doble click)
  function handleDoubleClick(day) {
    if (!day || day.fijo) return; // no editar si es fijo
    setSelectedDay(day);
    setEditValue(day.extras ? day.extras : day.pasajes);
    setEditType(day.extras ? "extras" : "pasajes");
    setEditFijo(day.fijo || false);
  }

  // Guardar día: persiste en BD via API y actualiza estado local
  async function handleSaveDay() {
    if (!selectedDay) return;
    try {
      const payload = {
        day: selectedDay.day,
        month: selectedMonth + 1,
        year: selectedYear,
        pasajes: editType === 'pasajes' ? parseFloat(editValue) || 0 : 0,
        extras: editType === 'extras' ? parseFloat(editValue) || 0 : 0,
        fijo: !!editFijo
      };

      const res = await API.post('/calendar', payload);

      if (res.data && res.data.success && res.data.entry) {
        const e = res.data.entry;
        // actualizar estado local data (reemplazar o agregar)
        setData(prev => {
          const exists = prev.find(x => x.day === e.day);
          const newItem = { id: e.id, day: e.day, pasajes: Number(e.pasajes), extras: Number(e.extras), fijo: !!e.fijo };
          if (exists) {
            return prev.map(p => (p.day === e.day ? newItem : p));
          } else {
            return [...prev, newItem];
          }
        });
      } else {
        console.error('Respuesta inesperada al guardar día', res.data);
      }
    } catch (error) {
      console.error('Error guardando día:', error);
    } finally {
      setSelectedDay(null);
    }
  }

  function handleChangeResumen(type, index, field, value) {
    setResumen(prev => {
      const updated = { ...prev };
      updated[type][index][field] = field === "valor" ? parseFloat(value) || 0 : value;
      return updated;
    });
  }

  function handleAddField(type) {
    setResumen(prev => ({
      ...prev,
      [type]: [...prev[type], { nombre: "Nuevo", valor: 0, fijo: false }]
    }));
  }

  function handleDeleteField(type, index) {
    setResumen(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  }

  const totalIngresos = resumen.ingresos.reduce((acc, cur) => acc + cur.valor, 0);
  const totalEgresos = resumen.egresos.reduce((acc, cur) => acc + cur.valor, 0);
  const totalAhorros = resumen.ahorros.reduce((acc, cur) => acc + cur.valor, 0);
  const balance = totalIngresos - totalEgresos - totalAhorros;

  return (
    <div className="home-wrapper">
      {/* Resumen — bloques horizontales encima del calendario */}
      <div className="resumen-container">
        {["ingresos", "egresos", "ahorros"].map(type => (
          <div className={`section ${type}`} key={type}>
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>

            {resumen[type].map((item, i) => (
              <label key={i} className="resumen-label">
                {item.nombre}:
                <input
                  type="number"
                  value={item.valor}
                  disabled
                  readOnly
                />
              </label>
            ))}

            <button onClick={() => setEditResumen(type)}>Editar</button>
          </div>
        ))}

        <div className="section balance">
          <h3>Balance</h3>
          <p>{balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Calendario (componente separado) */}
      <CalendarTable
        data={data}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onDayDoubleClick={handleDoubleClick}
      />

      {/* Modal Día */}
      {selectedDay && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar día {selectedDay.day}</h3>

            <select value={editType} onChange={(e) => setEditType(e.target.value)}>
              <option value="extras">Ingreso (Extras)</option>
              <option value="pasajes">Egreso (Pasajes)</option>
            </select>

            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{ marginTop: 8, width: '100%' }}
            />

            <label style={{ marginTop: "10px", display: "block" }}>
              Fijo:
              <input
                type="checkbox"
                checked={editFijo}
                onChange={(e) => setEditFijo(e.target.checked)}
                style={{ marginLeft: "8px" }}
              />
            </label>

            <div className="modal-buttons">
              <button onClick={handleSaveDay}>Guardar</button>
              <button onClick={() => setSelectedDay(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Resumen (editar listas) */}
      {editResumen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar {editResumen}</h3>

            {resumen[editResumen].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
                <input
                  type="text"
                  value={item.nombre}
                  onChange={(e) => handleChangeResumen(editResumen, i, "nombre", e.target.value)}
                />
                <input
                  type="number"
                  value={item.valor}
                  onChange={(e) => handleChangeResumen(editResumen, i, "valor", e.target.value)}
                />
                {editResumen !== "ahorros" && (
                  <label>
                    Fijo:
                    <input
                      style={{ marginLeft: "8px" }}
                      type="checkbox"
                      checked={!!item.fijo}
                      onChange={(e) => handleChangeResumen(editResumen, i, "fijo", e.target.checked)}
                    />
                  </label>
                )}
                <button onClick={() => handleDeleteField(editResumen, i)}>Eliminar</button>
              </div>
            ))}

            <button onClick={() => handleAddField(editResumen)}>Agregar campo</button>

            <div className="modal-buttons">
              <button onClick={() => setEditResumen(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
