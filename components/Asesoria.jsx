import './Asesoria.css';

const Asesoria = () => {
  return (
    <div className="asesoria-container">
      <div className="asesoria-header">
        <h1>Asesoría en Línea</h1>
        <p>Obtén asesoría personalizada de nuestros expertos</p>
      </div>

      <div className="asesoria-content">
        <div className="asesoria-card">
          <h2>💬 Chat en Vivo</h2>
          <p>Conéctate con un asesor en tiempo real</p>
          <button className="action-button">Iniciar Chat</button>
        </div>

        <div className="asesoria-card">
          <h2>📅 Agendar Cita</h2>
          <p>Programa una sesión de asesoría</p>
          <button className="action-button">Agendar</button>
        </div>

        <div className="asesoria-card">
          <h2>📚 Recursos</h2>
          <p>Accede a materiales y guías de estudio</p>
          <button className="action-button">Ver Recursos</button>
        </div>

        <div className="asesoria-card">
          <h2>📊 Historial</h2>
          <p>Revisa tus sesiones anteriores</p>
          <button className="action-button">Ver Historial</button>
        </div>
      </div>
    </div>
  );
};

export default Asesoria;

