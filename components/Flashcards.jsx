import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Flashcards.css';

const Flashcards = () => {
  const { flashcards, agregarFlashcard, actualizarFlashcard, materias } = useData();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [flashcardActual, setFlashcardActual] = useState(0);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [formData, setFormData] = useState({
    pregunta: '',
    respuesta: '',
    materia: '',
    dificultad: 'media',
  });

  const flashcardsFiltradas = flashcards;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pregunta.trim() && formData.respuesta.trim()) {
      agregarFlashcard(formData);
      setFormData({ pregunta: '', respuesta: '', materia: '', dificultad: 'media' });
      setMostrarFormulario(false);
    }
  };

  const siguienteFlashcard = () => {
    if (flashcardActual < flashcardsFiltradas.length - 1) {
      setFlashcardActual(flashcardActual + 1);
      setMostrarRespuesta(false);
    }
  };

  const anteriorFlashcard = () => {
    if (flashcardActual > 0) {
      setFlashcardActual(flashcardActual - 1);
      setMostrarRespuesta(false);
    }
  };

  const calificarFlashcard = (calificacion) => {
    if (flashcardsFiltradas[flashcardActual]) {
      const flashcard = flashcardsFiltradas[flashcardActual];
      actualizarFlashcard(flashcard.id, {
        repeticiones: (flashcard.repeticiones || 0) + 1,
        ultimaCalificacion: calificacion,
      });
      siguienteFlashcard();
    }
  };

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h1>🎴 Flashcards</h1>
        <button 
          className="btn-agregar"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Nueva Flashcard'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-flashcard">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Pregunta *</label>
              <textarea
                value={formData.pregunta}
                onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
                placeholder="Escribe la pregunta"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Respuesta *</label>
              <textarea
                value={formData.respuesta}
                onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                placeholder="Escribe la respuesta"
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Materia</label>
                <select
                  value={formData.materia}
                  onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                >
                  <option value="">Todas las materias</option>
                  {materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dificultad</label>
                <select
                  value={formData.dificultad}
                  onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                >
                  <option value="facil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-submit">Crear Flashcard</button>
          </form>
        </div>
      )}

      {flashcardsFiltradas.length === 0 ? (
        <div className="flashcards-empty">
          <p>No tienes flashcards creadas aún</p>
          <p>Crea tu primera flashcard para comenzar a estudiar</p>
        </div>
      ) : (
        <div className="flashcards-viewer">
          <div className="flashcard-counter">
            {flashcardActual + 1} / {flashcardsFiltradas.length}
          </div>

          <div 
            className={`flashcard ${mostrarRespuesta ? 'flipped' : ''}`}
            onClick={() => setMostrarRespuesta(!mostrarRespuesta)}
          >
            <div className="flashcard-front">
              <div className="flashcard-content">
                <h3>Pregunta</h3>
                <p>{flashcardsFiltradas[flashcardActual]?.pregunta}</p>
                <span className="flashcard-hint">Haz clic para ver la respuesta</span>
              </div>
            </div>
            <div className="flashcard-back">
              <div className="flashcard-content">
                <h3>Respuesta</h3>
                <p>{flashcardsFiltradas[flashcardActual]?.respuesta}</p>
              </div>
            </div>
          </div>

          <div className="flashcard-controls">
            <button 
              onClick={anteriorFlashcard}
              disabled={flashcardActual === 0}
              className="btn-control"
            >
              ← Anterior
            </button>
            
            <div className="calificacion-buttons">
              <button 
                onClick={() => calificarFlashcard('dificil')}
                className="btn-calificar dificil"
              >
                😓 Difícil
              </button>
              <button 
                onClick={() => calificarFlashcard('media')}
                className="btn-calificar media"
              >
                😐 Media
              </button>
              <button 
                onClick={() => calificarFlashcard('facil')}
                className="btn-calificar facil"
              >
                😊 Fácil
              </button>
            </div>

            <button 
              onClick={siguienteFlashcard}
              disabled={flashcardActual === flashcardsFiltradas.length - 1}
              className="btn-control"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;

