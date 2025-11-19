import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import './Materias.css';

const Materias = () => {
  const { materias, agregarMateria, eliminarMateria } = useData();
  const { isMaestro, isAdmin } = useAuth();
  const puedeCrear = isMaestro() || isAdmin();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    profesor: '',
    descripcion: '',
    color: '#667eea',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre.trim()) {
      agregarMateria(formData);
      setFormData({ nombre: '', codigo: '', profesor: '', descripcion: '', color: '#667eea' });
      setMostrarFormulario(false);
    }
  };

  return (
    <div className="materias-container">
      <div className="materias-header">
        <h1>📚 Mis Materias</h1>
        {puedeCrear && (
          <button 
            className="btn-agregar"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Agregar Materia'}
          </button>
        )}
      </div>

      {!puedeCrear && (
        <div className="info-mensaje">
          <p>ℹ️ Solo los maestros y administradores pueden crear materias.</p>
          <p>Puedes ver las materias disponibles a continuación.</p>
        </div>
      )}

      {mostrarFormulario && puedeCrear && (
        <div className="formulario-materia">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre de la Materia *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Matemáticas"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ej: MAT101"
                />
              </div>

              <div className="form-group">
                <label>Profesor</label>
                <input
                  type="text"
                  value={formData.profesor}
                  onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
                  placeholder="Nombre del profesor"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción de la materia"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-submit">Agregar Materia</button>
          </form>
        </div>
      )}

      <div className="materias-grid">
        {materias.length === 0 ? (
          <div className="empty-state">
            <p>No tienes materias agregadas aún</p>
            <p>Haz clic en "Agregar Materia" para comenzar</p>
          </div>
        ) : (
          materias.map((materia) => (
            <div
              key={materia.id}
              className="materia-card"
              style={{ borderTopColor: materia.color }}
            >
              <div className="materia-header-card">
                <h3>{materia.nombre}</h3>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarMateria(materia.id)}
                  title="Eliminar materia"
                >
                  🗑️
                </button>
              </div>
              {materia.codigo && <p className="materia-codigo">{materia.codigo}</p>}
              {materia.profesor && <p className="materia-profesor">👨‍🏫 {materia.profesor}</p>}
              {materia.descripcion && <p className="materia-descripcion">{materia.descripcion}</p>}
              <div className="materia-footer">
                <span className="materia-fecha">
                  Creada: {new Date(materia.fechaCreacion).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Materias;

