import { useData } from '../contexts/DataContext';
import './Historial.css';

const Historial = () => {
  const { historial } = useData();

  const getIcono = (tipo) => {
    const iconos = {
      materia_agregada: '📚',
      materia_eliminada: '🗑️',
      recurso_agregado: '📄',
      cita_agendada: '📅',
      cita_cancelada: '❌',
      mensaje_enviado: '💬',
      examen_creado: '📝',
      examen_completado: '✅',
    };
    return iconos[tipo] || '📌';
  };

  const getColor = (tipo) => {
    const colores = {
      materia_agregada: '#667eea',
      materia_eliminada: '#ef4444',
      recurso_agregado: '#10b981',
      cita_agendada: '#f59e0b',
      cita_cancelada: '#ef4444',
      mensaje_enviado: '#3b82f6',
      examen_creado: '#8b5cf6',
      examen_completado: '#10b981',
    };
    return colores[tipo] || '#666';
  };

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h1>📊 Mi Historial</h1>
        <p>Registro de todas tus actividades</p>
      </div>

      <div className="historial-list">
        {historial.length === 0 ? (
          <div className="empty-state">
            <p>No hay actividades registradas aún</p>
            <p>Tu historial aparecerá aquí cuando comiences a usar la aplicación</p>
          </div>
        ) : (
          historial.map((entrada) => (
            <div key={entrada.id} className="historial-item">
              <div 
                className="historial-icon"
                style={{ backgroundColor: `${getColor(entrada.tipo)}20`, color: getColor(entrada.tipo) }}
              >
                {getIcono(entrada.tipo)}
              </div>
              <div className="historial-content">
                <p className="historial-descripcion">{entrada.descripcion}</p>
                <span className="historial-fecha">
                  {new Date(entrada.fecha).toLocaleString('es-ES')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Historial;

