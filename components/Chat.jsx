import { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = () => {
  const { mensajes, enviarMensaje } = useData();
  const { user, isMaestro, isEstudiante, getAllUsers } = useAuth();
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const mensajesEndRef = useRef(null);

  // Obtener profesores dinámicamente de los usuarios con rol maestro
  const profesores = getAllUsers()
    .filter(u => u.role === 'maestro' && !u.bloqueado)
    .map(u => u.username);

  // Si es profesor, mostrar todos los mensajes de estudiantes y sus respuestas; si es estudiante, mostrar mensajes del profesor seleccionado
  const esProfesor = isMaestro();
  const nombreProfesor = esProfesor ? user?.username || 'Profesor' : profesorSeleccionado;
  
  // Para profesores: mostrar todos los mensajes de estudiantes dirigidos a cualquier profesor
  // y todas las respuestas de profesores
  // Para estudiantes: mostrar mensajes del profesor seleccionado (tanto enviados como recibidos)
  let mensajesDelProfesor = esProfesor 
    ? mensajes.filter(m => {
        // Profesores ven:
        // 1. Todos los mensajes de estudiantes (dirigidos a cualquier profesor)
        // 2. Todas las respuestas de profesores
        if (m.remitente === 'estudiante') return true;
        if (m.remitente === 'profesor') {
          // Ver respuestas de cualquier profesor o del profesor actual
          return profesores.includes(m.profesor) || m.profesorUsername === user?.username;
        }
        return false;
      })
    : mensajes.filter(m => {
        // Estudiantes ven mensajes donde:
        // 1. El campo "profesor" coincide con el profesor seleccionado
        // 2. O es una respuesta del profesor seleccionado
        if (!profesorSeleccionado) return false;
        return m.profesor === profesorSeleccionado;
      });
  
  // Ordenar por fecha
  mensajesDelProfesor = [...mensajesDelProfesor].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajesDelProfesor]);

  // Forzar actualización cuando cambien los mensajes en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // Recargar mensajes desde localStorage
      const savedMensajes = localStorage.getItem('mensajes');
      if (savedMensajes) {
        try {
          const parsed = JSON.parse(savedMensajes);
          // El DataContext se encargará de actualizar el estado
        } catch (e) {
          // Error silencioso
        }
      }
    };

    // Escuchar cambios en localStorage (de otras pestañas/ventanas)
    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente
    const interval = setInterval(handleStorageChange, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (esProfesor) {
      // Si es profesor, enviar mensaje como profesor
      // Responder al último mensaje del estudiante, manteniendo el mismo profesor destino
      if (nuevoMensaje.trim()) {
        // Buscar el último mensaje de estudiante para obtener el profesor destino
        const ultimoMensajeEstudiante = mensajesDelProfesor
          .filter(m => m.remitente === 'estudiante')
          .slice(-1)[0];
        
        // Usar el profesor del último mensaje del estudiante para mantener la conversación
        const profesorDestino = ultimoMensajeEstudiante?.profesor || user?.username || 'Profesor';
        
        enviarMensaje({
          profesor: profesorDestino, // Mantener el mismo profesor para que el estudiante vea la respuesta
          mensaje: nuevoMensaje,
          remitente: 'profesor',
        }, user);
        setNuevoMensaje('');
      }
    } else {
      // Si es estudiante, enviar mensaje como estudiante
      if (nuevoMensaje.trim() && profesorSeleccionado) {
        enviarMensaje({
          profesor: profesorSeleccionado,
          mensaje: nuevoMensaje,
          remitente: 'estudiante',
        }, user);
        setNuevoMensaje('');
      }
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>{esProfesor ? '💬 Mensajes de Estudiantes' : '💬 Chat con Profesores'}</h1>
      </div>

      <div className="chat-layout">
        {!esProfesor && (
          <div className="profesores-sidebar">
            <h3>Profesores Disponibles</h3>
            {profesores.map((prof) => (
              <button
                key={prof}
                className={`profesor-item ${profesorSeleccionado === prof ? 'active' : ''}`}
                onClick={() => setProfesorSeleccionado(prof)}
              >
                👨‍🏫 {prof}
              </button>
            ))}
          </div>
        )}

        <div className="chat-main">
          {!esProfesor && !profesorSeleccionado ? (
            <div className="chat-empty">
              <p>Selecciona un profesor para comenzar a chatear</p>
            </div>
          ) : (
            <>
              {esProfesor && (
                <div className="chat-header-info">
                  <h3>Mensajes de estudiantes - {user?.username}</h3>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                    Puedes ver todos los mensajes que los estudiantes han enviado a los profesores
                  </p>
                </div>
              )}
              <div className="chat-messages">
                {mensajesDelProfesor.length === 0 ? (
                  <div className="chat-empty">
                    <p>{esProfesor ? 'No hay mensajes de estudiantes aún.' : 'No hay mensajes aún. ¡Envía el primero!'}</p>
                  </div>
                ) : (
                  mensajesDelProfesor.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mensaje ${msg.remitente === 'estudiante' ? (esProfesor ? 'mensaje-recibido' : 'mensaje-enviado') : (esProfesor ? 'mensaje-enviado' : 'mensaje-recibido')}`}
                    >
                      <div className="mensaje-contenido">
                        {msg.remitente === 'estudiante' && msg.estudianteUsername && (
                          <div className="mensaje-header">
                            <span className="mensaje-estudiante">{msg.estudianteUsername}</span>
                            {msg.estudianteEspecialidad && (
                              <span className="mensaje-especialidad">📚 {msg.estudianteEspecialidad}</span>
                            )}
                            {esProfesor && msg.profesor && (
                              <span className="mensaje-profesor-destino" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                → {msg.profesor}
                              </span>
                            )}
                          </div>
                        )}
                        <p>{msg.mensaje}</p>
                        <span className="mensaje-fecha">
                          {new Date(msg.fecha).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={mensajesEndRef} />
              </div>

              <form className="chat-input-form" onSubmit={handleEnviar}>
                <input
                  type="text"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  placeholder={esProfesor ? "Escribe tu respuesta..." : "Escribe tu mensaje..."}
                  className="chat-input"
                />
                <button type="submit" className="chat-send-btn" disabled={!nuevoMensaje.trim() || (!esProfesor && !profesorSeleccionado)}>
                  Enviar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

