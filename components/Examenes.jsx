import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { jsPDF } from 'jspdf';
import './Examenes.css';

const Examenes = () => {
  const { examenes, crearExamen, completarExamen, materias } = useData();
  const { user } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [examenSeleccionado, setExamenSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    materia: '',
    descripcion: '',
    tipo: 'generado_ia',
  });

  const generarExamenIA = async () => {
    // Simulación de generación de examen con IA
    const preguntasGeneradas = [
      {
        id: 1,
        pregunta: '¿Cuál es la capital de Francia?',
        opciones: ['Londres', 'Berlín', 'París', 'Madrid'],
        respuestaCorrecta: 2,
      },
      {
        id: 2,
        pregunta: '¿Cuántos continentes hay en el mundo?',
        opciones: ['5', '6', '7', '8'],
        respuestaCorrecta: 2,
      },
      {
        id: 3,
        pregunta: '¿Cuál es el planeta más grande del sistema solar?',
        opciones: ['Tierra', 'Marte', 'Júpiter', 'Saturno'],
        respuestaCorrecta: 2,
      },
      {
        id: 4,
        pregunta: '¿En qué año comenzó la Segunda Guerra Mundial?',
        opciones: ['1937', '1938', '1939', '1940'],
        respuestaCorrecta: 2,
      },
      {
        id: 5,
        pregunta: '¿Cuál es el símbolo químico del agua?',
        opciones: ['H2O', 'CO2', 'O2', 'NaCl'],
        respuestaCorrecta: 0,
      },
    ];

    const nuevoExamen = {
      titulo: formData.titulo || 'Examen Generado por IA',
      materia: formData.materia,
      descripcion: formData.descripcion || 'Examen generado automáticamente con inteligencia artificial',
      tipo: 'generado_ia',
      preguntas: preguntasGeneradas,
    };

    const examen = crearExamen(nuevoExamen, user);
    setExamenSeleccionado(examen);
    setMostrarFormulario(false);
    setFormData({ titulo: '', materia: '', descripcion: '', tipo: 'generado_ia' });
  };

  const examenesPendientes = examenes.filter(e => !e.completado);
  const examenesCompletados = examenes.filter(e => e.completado);

  const descargarPDF = (examen) => {
    const doc = new jsPDF();
    const materia = materias.find(m => m.id === examen.materia);
    
    // Título
    doc.setFontSize(18);
    doc.text(examen.titulo, 20, 20);
    
    // Información
    doc.setFontSize(12);
    if (materia) {
      doc.text(`Materia: ${materia.nombre}`, 20, 35);
    }
    if (examen.descripcion) {
      doc.text(`Descripción: ${examen.descripcion}`, 20, 45);
    }
    if (examen.resultado) {
      doc.text(`Puntuación: ${examen.resultado.puntuacion}%`, 20, 55);
      doc.text(`Respuestas correctas: ${examen.resultado.correctas} de ${examen.resultado.total}`, 20, 65);
    }
    doc.text(`Fecha: ${new Date(examen.fechaCompletado || examen.fechaCreacion).toLocaleDateString('es-ES')}`, 20, 75);
    
    // Preguntas
    let yPos = 90;
    doc.setFontSize(14);
    doc.text('Preguntas:', 20, yPos);
    yPos += 10;
    
    examen.preguntas?.forEach((pregunta, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${pregunta.pregunta}`, 20, yPos);
      yPos += 8;
      
      doc.setFont(undefined, 'normal');
      pregunta.opciones.forEach((opcion, opcIndex) => {
        const marcador = opcIndex === pregunta.respuestaCorrecta ? '✓' : '○';
        doc.text(`  ${marcador} ${opcion}`, 25, yPos);
        yPos += 6;
      });
      yPos += 5;
    });
    
    // Guardar
    const nombreArchivo = `${examen.titulo.replace(/[^a-z0-9]/gi, '_')}_${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);
  };

  return (
    <div className="examenes-container">
      <div className="examenes-header">
        <h1>📝 Exámenes con IA</h1>
        <button 
          className="btn-agregar"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Generar Examen con IA'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-examen">
          <form onSubmit={(e) => { e.preventDefault(); generarExamenIA(); }}>
            <div className="form-group">
              <label>Título del Examen</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Examen de Matemáticas - Capítulo 3"
              />
            </div>

            <div className="form-group">
              <label>Materia</label>
              <select
                value={formData.materia}
                onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
              >
                <option value="">Seleccionar materia</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe el tema del examen"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">
              🤖 Generar Examen con IA
            </button>
          </form>
        </div>
      )}

      {examenSeleccionado && !examenSeleccionado.completado && (
        <Quiz 
          examen={examenSeleccionado}
          onCompletar={(resultado) => {
            completarExamen(examenSeleccionado.id, resultado, user);
            setExamenSeleccionado(null);
          }}
          onCancelar={() => setExamenSeleccionado(null)}
        />
      )}

      {!examenSeleccionado && (
        <>
          <div className="examenes-section">
            <h2>Exámenes Pendientes</h2>
            <div className="examenes-grid">
              {examenesPendientes.length === 0 ? (
                <div className="empty-state">
                  <p>No tienes exámenes pendientes</p>
                </div>
              ) : (
                examenesPendientes.map((examen) => {
                  const materia = materias.find(m => m.id === examen.materia);
                  return (
                    <div key={examen.id} className="examen-card pendiente">
                      <h3>{examen.titulo}</h3>
                      {materia && (
                        <span className="examen-materia" style={{ color: materia.color }}>
                          {materia.nombre}
                        </span>
                      )}
                      {examen.descripcion && <p>{examen.descripcion}</p>}
                      <div className="examen-info">
                        <span>📝 {examen.preguntas?.length || 0} preguntas</span>
                        {examen.creadorUsername && (
                          <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '1rem' }}>
                            👤 Creado por: {examen.creadorUsername}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn-iniciar"
                        onClick={() => setExamenSeleccionado(examen)}
                      >
                        Iniciar Examen
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {examenesCompletados.length > 0 && (
            <div className="examenes-section">
              <h2>Exámenes Completados</h2>
              <div className="examenes-grid">
                {examenesCompletados.map((examen) => {
                  const materia = materias.find(m => m.id === examen.materia);
                  return (
                    <div key={examen.id} className="examen-card completado">
                      <h3>{examen.titulo}</h3>
                      {materia && (
                        <span className="examen-materia" style={{ color: materia.color }}>
                          {materia.nombre}
                        </span>
                      )}
                      <div className="examen-resultado">
                        <span className="puntuacion">
                          Puntuación: {examen.resultado?.puntuacion || 0}%
                        </span>
                        <span className="fecha">
                          {new Date(examen.fechaCompletado).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      {examen.creadorUsername && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                          👤 Creado por: {examen.creadorUsername}
                        </div>
                      )}
                      {examen.completadoPorUsername && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                          ✅ Completado por: {examen.completadoPorUsername}
                        </div>
                      )}
                      <button
                        className="btn-descargar-pdf"
                        onClick={() => descargarPDF(examen)}
                        title="Descargar examen como PDF"
                      >
                        📥 Descargar PDF
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Componente Quiz integrado
const Quiz = ({ examen, onCompletar, onCancelar }) => {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const pregunta = examen.preguntas?.[preguntaActual];
  const totalPreguntas = examen.preguntas?.length || 0;

  const handleRespuesta = (opcionIndex) => {
    setRespuestas({
      ...respuestas,
      [preguntaActual]: opcionIndex,
    });
  };

  const siguientePregunta = () => {
    if (preguntaActual < totalPreguntas - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      calcularResultado();
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  const calcularResultado = () => {
    let correctas = 0;
    examen.preguntas.forEach((pregunta, index) => {
      if (respuestas[index] === pregunta.respuestaCorrecta) {
        correctas++;
      }
    });
    const puntuacion = Math.round((correctas / totalPreguntas) * 100);
    setMostrarResultado(true);
    setTimeout(() => {
      onCompletar({
        correctas,
        total: totalPreguntas,
        puntuacion,
      });
    }, 3000);
  };

  if (mostrarResultado) {
    const correctas = examen.preguntas.filter((p, i) => respuestas[i] === p.respuestaCorrecta).length;
    const puntuacion = Math.round((correctas / totalPreguntas) * 100);
    
    return (
      <div className="quiz-resultado">
        <div className="resultado-content">
          <h2>🎉 Examen Completado</h2>
          <div className="puntuacion-final">
            <span className="puntuacion-numero">{puntuacion}%</span>
            <p>{correctas} de {totalPreguntas} respuestas correctas</p>
          </div>
          <div className="resultado-mensaje">
            {puntuacion >= 80 ? '¡Excelente trabajo! 🎊' : 
             puntuacion >= 60 ? 'Buen trabajo, sigue así! 👍' : 
             'Sigue estudiando, puedes mejorar! 💪'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{examen.titulo}</h2>
        <button className="btn-cancelar-quiz" onClick={onCancelar}>Cancelar</button>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((preguntaActual + 1) / totalPreguntas) * 100}%` }}
          />
        </div>
        <span>Pregunta {preguntaActual + 1} de {totalPreguntas}</span>
      </div>

      <div className="quiz-pregunta">
        <h3>{pregunta?.pregunta}</h3>
        <div className="quiz-opciones">
          {pregunta?.opciones.map((opcion, index) => (
            <button
              key={index}
              className={`opcion-btn ${respuestas[preguntaActual] === index ? 'seleccionada' : ''}`}
              onClick={() => handleRespuesta(index)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-controls">
        <button
          onClick={preguntaAnterior}
          disabled={preguntaActual === 0}
          className="btn-quiz-nav"
        >
          ← Anterior
        </button>
        <button
          onClick={siguientePregunta}
          disabled={respuestas[preguntaActual] === undefined}
          className="btn-quiz-nav btn-primary"
        >
          {preguntaActual === totalPreguntas - 1 ? 'Finalizar' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
};

export default Examenes;

