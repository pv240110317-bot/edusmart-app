import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [materias, setMaterias] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [citas, setCitas] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedMaterias = localStorage.getItem('materias');
    const savedRecursos = localStorage.getItem('recursos');
    const savedCitas = localStorage.getItem('citas');
    const savedMensajes = localStorage.getItem('mensajes');
    const savedExamenes = localStorage.getItem('examenes');
    const savedFlashcards = localStorage.getItem('flashcards');
    const savedHistorial = localStorage.getItem('historial');

    if (savedMaterias) setMaterias(JSON.parse(savedMaterias));
    if (savedRecursos) setRecursos(JSON.parse(savedRecursos));
    if (savedCitas) setCitas(JSON.parse(savedCitas));
    if (savedMensajes) setMensajes(JSON.parse(savedMensajes));
    if (savedExamenes) setExamenes(JSON.parse(savedExamenes));
    if (savedFlashcards) setFlashcards(JSON.parse(savedFlashcards));
    if (savedHistorial) setHistorial(JSON.parse(savedHistorial));
  }, []);

  // Sincronizar mensajes y exámenes periódicamente para compartir entre usuarios
  useEffect(() => {
    const interval = setInterval(() => {
      const savedMensajes = localStorage.getItem('mensajes');
      const savedExamenes = localStorage.getItem('examenes');
      
      if (savedMensajes) {
        try {
          const parsed = JSON.parse(savedMensajes);
          // Solo actualizar si hay cambios
          if (JSON.stringify(parsed) !== JSON.stringify(mensajes)) {
            setMensajes(parsed);
          }
        } catch (e) {
          // Error silencioso
        }
      }
      
      if (savedExamenes) {
        try {
          const parsed = JSON.parse(savedExamenes);
          // Solo actualizar si hay cambios
          if (JSON.stringify(parsed) !== JSON.stringify(examenes)) {
            setExamenes(parsed);
          }
        } catch (e) {
          // Error silencioso
        }
      }
    }, 2000); // Sincronizar cada 2 segundos

    return () => clearInterval(interval);
  }, [mensajes, examenes]);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('materias', JSON.stringify(materias));
  }, [materias]);

  useEffect(() => {
    localStorage.setItem('recursos', JSON.stringify(recursos));
  }, [recursos]);

  useEffect(() => {
    localStorage.setItem('citas', JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
  }, [mensajes]);

  useEffect(() => {
    localStorage.setItem('examenes', JSON.stringify(examenes));
  }, [examenes]);

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('historial', JSON.stringify(historial));
  }, [historial]);

  // Funciones para materias
  const agregarMateria = (materia) => {
    const nuevaMateria = {
      id: Date.now().toString(),
      ...materia,
      fechaCreacion: new Date().toISOString(),
    };
    setMaterias([...materias, nuevaMateria]);
    agregarAlHistorial('materia_agregada', `Agregaste la materia: ${materia.nombre}`);
    return nuevaMateria;
  };

  const eliminarMateria = (id) => {
    const materia = materias.find(m => m.id === id);
    setMaterias(materias.filter(m => m.id !== id));
    if (materia) {
      agregarAlHistorial('materia_eliminada', `Eliminaste la materia: ${materia.nombre}`);
    }
  };

  // Funciones para recursos
  const agregarRecurso = (recurso) => {
    const nuevoRecurso = {
      id: Date.now().toString(),
      ...recurso,
      fechaCreacion: new Date().toISOString(),
    };
    setRecursos([...recursos, nuevoRecurso]);
    agregarAlHistorial('recurso_agregado', `Agregaste el recurso: ${recurso.titulo}`);
    return nuevoRecurso;
  };

  // Funciones para citas
  const agendarCita = (cita) => {
    const nuevaCita = {
      id: Date.now().toString(),
      ...cita,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
    };
    setCitas([...citas, nuevaCita]);
    agregarAlHistorial('cita_agendada', `Agendaste una cita con ${cita.profesor} para ${cita.fecha}`);
    return nuevaCita;
  };

  const cancelarCita = (id) => {
    const cita = citas.find(c => c.id === id);
    setCitas(citas.map(c => c.id === id ? { ...c, estado: 'cancelada' } : c));
    if (cita) {
      agregarAlHistorial('cita_cancelada', `Cancelaste la cita con ${cita.profesor}`);
    }
  };

  // Funciones para mensajes
  const enviarMensaje = (mensaje, usuarioActual = null) => {
    const nuevoMensaje = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...mensaje,
      fecha: new Date().toISOString(),
      leido: false,
      // Incluir información del estudiante si es un mensaje de estudiante
      ...(mensaje.remitente === 'estudiante' && usuarioActual ? {
        estudianteId: usuarioActual.id,
        estudianteUsername: usuarioActual.username,
        estudianteEspecialidad: usuarioActual.especialidad || 'Sin especialidad',
      } : {}),
      // Incluir información del profesor si es un mensaje de profesor
      ...(mensaje.remitente === 'profesor' && usuarioActual ? {
        profesorId: usuarioActual.id,
        profesorUsername: usuarioActual.username,
      } : {}),
    };
    const nuevosMensajes = [...mensajes, nuevoMensaje];
    setMensajes(nuevosMensajes);
    // Guardar inmediatamente en localStorage
    localStorage.setItem('mensajes', JSON.stringify(nuevosMensajes));
    agregarAlHistorial('mensaje_enviado', `Enviaste un mensaje a ${mensaje.profesor}`);
    return nuevoMensaje;
  };

  // Funciones para exámenes
  const crearExamen = (examen, usuarioActual = null) => {
    const nuevoExamen = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...examen,
      fechaCreacion: new Date().toISOString(),
      completado: false,
      // Incluir información del creador
      ...(usuarioActual ? {
        creadorId: usuarioActual.id,
        creadorUsername: usuarioActual.username,
        creadorRole: usuarioActual.role,
      } : {}),
    };
    const nuevosExamenes = [...examenes, nuevoExamen];
    setExamenes(nuevosExamenes);
    // Guardar inmediatamente en localStorage
    localStorage.setItem('examenes', JSON.stringify(nuevosExamenes));
    agregarAlHistorial('examen_creado', `Creaste el examen: ${examen.titulo}`);
    return nuevoExamen;
  };

  const completarExamen = (id, resultado, usuarioActual = null) => {
    const examenesActualizados = examenes.map(e => 
      e.id === id 
        ? { 
            ...e, 
            completado: true, 
            resultado, 
            fechaCompletado: new Date().toISOString(),
            // Guardar información de quién completó el examen
            ...(usuarioActual ? {
              completadoPor: usuarioActual.id,
              completadoPorUsername: usuarioActual.username,
            } : {}),
          }
        : e
    );
    setExamenes(examenesActualizados);
    // Guardar inmediatamente en localStorage
    localStorage.setItem('examenes', JSON.stringify(examenesActualizados));
    const examen = examenes.find(e => e.id === id);
    if (examen) {
      agregarAlHistorial('examen_completado', `Completaste el examen: ${examen.titulo} - Puntuación: ${resultado.puntuacion}%`);
    }
  };

  // Funciones para flashcards
  const agregarFlashcard = (flashcard) => {
    const nuevaFlashcard = {
      id: Date.now().toString(),
      ...flashcard,
      fechaCreacion: new Date().toISOString(),
      repeticiones: 0,
      ultimaRevision: null,
    };
    setFlashcards([...flashcards, nuevaFlashcard]);
    return nuevaFlashcard;
  };

  const actualizarFlashcard = (id, datos) => {
    setFlashcards(flashcards.map(f => 
      f.id === id 
        ? { ...f, ...datos, ultimaRevision: new Date().toISOString() }
        : f
    ));
  };

  // Función para historial
  const agregarAlHistorial = (tipo, descripcion) => {
    const nuevaEntrada = {
      id: Date.now().toString(),
      tipo,
      descripcion,
      fecha: new Date().toISOString(),
    };
    setHistorial([nuevaEntrada, ...historial].slice(0, 100)); // Mantener solo las últimas 100
  };

  const value = {
    materias,
    recursos,
    citas,
    mensajes,
    examenes,
    flashcards,
    historial,
    agregarMateria,
    eliminarMateria,
    agregarRecurso,
    agendarCita,
    cancelarCita,
    enviarMensaje,
    crearExamen,
    completarExamen,
    agregarFlashcard,
    actualizarFlashcard,
    agregarAlHistorial,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

