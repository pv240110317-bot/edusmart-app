import { useState } from 'react';
import './IA.css';

const IA = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    // Simulación de respuesta de IA (aquí integrarías tu API de IA)
    setTimeout(() => {
      setResponse(`Respuesta simulada para: "${prompt}"\n\nEn una implementación real, aquí se integraría con una API de IA como OpenAI, Claude, o similar.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="ia-container">
      <div className="ia-header">
        <h1>Integración de IA</h1>
        <p>Interactúa con nuestra inteligencia artificial</p>
      </div>

      <div className="ia-content">
        <div className="ia-chat-container">
          <div className="ia-chat-header">
            <h2>💬 Asistente de IA</h2>
          </div>

          <div className="ia-chat-messages">
            {response && (
              <div className="message ai-message">
                <p>{response}</p>
              </div>
            )}
            {!response && (
              <div className="empty-state">
                <p>Escribe un mensaje para comenzar la conversación</p>
              </div>
            )}
          </div>

          <form className="ia-chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe tu pregunta o solicitud..."
              className="ia-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="ia-submit-button"
              disabled={loading || !prompt.trim()}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>

        <div className="ia-features">
          <div className="feature-card">
            <h3>🤖 Asistente Virtual</h3>
            <p>Obtén respuestas instantáneas a tus preguntas</p>
          </div>

          <div className="feature-card">
            <h3>📝 Generación de Contenido</h3>
            <p>Crea materiales educativos con IA</p>
          </div>

          <div className="feature-card">
            <h3>🎯 Análisis Inteligente</h3>
            <p>Analiza y mejora tu rendimiento académico</p>
          </div>

          <div className="feature-card">
            <h3>🔍 Búsqueda Avanzada</h3>
            <p>Encuentra información relevante rápidamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IA;

