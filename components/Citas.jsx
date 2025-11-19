import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Citas.css';

const Citas = () => {
  const { citas, agendarCita, cancelarCita } = useData();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    profesor: '',
    materia: '',
    fecha: '',
    hora: '',
    motivo: '',
  });

  const profesores = ['Dr. García', 'Dra. Martínez', 'Prof. López', 'Dr. Rodríguez', 'Dra. Sánchez'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.profesor && formData.fecha && formData.hora) {
      agendarCita(formData);
      setFormData({ profesor: '', materia: '', fecha: '', hora: '', motivo: '' });
      setMostrarFormulario(false);
    }
  };

  const citasPendientes = citas.filter(c => c.estado === 'pendiente');
  const citasPasadas = citas.filter(c => c.estado !== 'pendiente' || new Date(c.fecha) < new Date());

  return (
    <div className="citas-container">
      <div className="citas-header">
        <h1>📅 Agendar Cita</h1>
        <button 
          className="btn-agregar"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Nueva Cita'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-cita">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Profesor *</label>
                <select
                  value={formData.profesor}
                  onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
                  required
                >
                  <option value="">Seleccionar profesor</option>
                  {profesores.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Materia</label>
                <input
                  type="text"
                  value={formData.materia}
                  onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                  placeholder="Nombre de la materia"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Motivo de la Cita</label>
              <textarea
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="Describe el motivo de la cita"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">Agendar Cita</button>
          </form>
        </div>
      )}

      <div className="citas-section">
        <h2>Citas Pendientes</h2>
        <div className="citas-grid">
          {citasPendientes.length === 0 ? (
            <div className="empty-state">
              <p>No tienes citas pendientes</p>
            </div>
          ) : (
            citasPendientes.map((cita) => (
              <div key={cita.id} className="cita-card pendiente">
                <div className="cita-header">
                  <h3>👨‍🏫 {cita.profesor}</h3>
                  <button
                    className="btn-cancelar"
                    onClick={() => cancelarCita(cita.id)}
                  >
                    Cancelar
                  </button>
                </div>
                {cita.materia && <p className="cita-materia">{cita.materia}</p>}
                <div className="cita-fecha-hora">
                  <span>📅 {new Date(cita.fecha).toLocaleDateString('es-ES')}</span>
                  <span>🕐 {cita.hora}</span>
                </div>
                {cita.motivo && <p className="cita-motivo">{cita.motivo}</p>}
                <span className="cita-estado pendiente">Pendiente</span>
              </div>
            ))
          )}
        </div>
      </div>

      {citasPasadas.length > 0 && (
        <div className="citas-section">
          <h2>Citas Anteriores</h2>
          <div className="citas-grid">
            {citasPasadas.map((cita) => (
              <div key={cita.id} className="cita-card pasada">
                <div className="cita-header">
                  <h3>👨‍🏫 {cita.profesor}</h3>
                </div>
                {cita.materia && <p className="cita-materia">{cita.materia}</p>}
                <div className="cita-fecha-hora">
                  <span>📅 {new Date(cita.fecha).toLocaleDateString('es-ES')}</span>
                  <span>🕐 {cita.hora}</span>
                </div>
                <span className="cita-estado pasada">{cita.estado === 'cancelada' ? 'Cancelada' : 'Completada'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Citas;

