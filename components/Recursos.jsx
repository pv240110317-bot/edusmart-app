import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import './Recursos.css';

const Recursos = () => {
  const { recursos, agregarRecurso, materias } = useData();
  const { isMaestro, isAdmin } = useAuth();
  const puedeCrear = isMaestro() || isAdmin();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'documento',
    materia: '',
    url: '',
    descripcion: '',
  });

  const tiposRecurso = [
    { value: 'documento', label: '📄 Documento' },
    { value: 'video', label: '🎥 Video' },
    { value: 'enlace', label: '🔗 Enlace' },
    { value: 'imagen', label: '🖼️ Imagen' },
    { value: 'audio', label: '🎵 Audio' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.titulo.trim()) {
      agregarRecurso(formData);
      setFormData({ titulo: '', tipo: 'documento', materia: '', url: '', descripcion: '' });
      setMostrarFormulario(false);
    }
  };

  const getTipoIcon = (tipo) => {
    return tiposRecurso.find(t => t.value === tipo)?.label || '📄';
  };

  return (
    <div className="recursos-container">
      <div className="recursos-header">
        <h1>📚 Recursos Educativos</h1>
        {puedeCrear && (
          <button 
            className="btn-agregar"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Agregar Recurso'}
          </button>
        )}
      </div>

      {!puedeCrear && (
        <div className="info-mensaje">
          <p>ℹ️ Solo los maestros y administradores pueden crear recursos.</p>
          <p>Puedes ver los recursos disponibles a continuación.</p>
        </div>
      )}

      {mostrarFormulario && puedeCrear && (
        <div className="formulario-recurso">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título del Recurso *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Apuntes de Matemáticas"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Recurso</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  {tiposRecurso.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Materia</label>
                <select
                  value={formData.materia}
                  onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                >
                  <option value="">Seleccionar materia</option>
                  {materias.map(materia => (
                    <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>URL o Enlace</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del recurso"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">Agregar Recurso</button>
          </form>
        </div>
      )}

      <div className="recursos-grid">
        {recursos.length === 0 ? (
          <div className="empty-state">
            <p>No tienes recursos agregados aún</p>
            <p>Haz clic en "Agregar Recurso" para comenzar</p>
          </div>
        ) : (
          recursos.map((recurso) => {
            const materia = materias.find(m => m.id === recurso.materia);
            return (
              <div key={recurso.id} className="recurso-card">
                <div className="recurso-icon">{getTipoIcon(recurso.tipo)}</div>
                <h3>{recurso.titulo}</h3>
                {materia && (
                  <span className="recurso-materia" style={{ color: materia.color }}>
                    {materia.nombre}
                  </span>
                )}
                {recurso.descripcion && <p className="recurso-descripcion">{recurso.descripcion}</p>}
                {recurso.url && (
                  <a 
                    href={recurso.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="recurso-link"
                  >
                    Abrir recurso →
                  </a>
                )}
                <div className="recurso-footer">
                  <span className="recurso-fecha">
                    {new Date(recurso.fechaCreacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Recursos;

