import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PostItem = ({ post, categorias, onToggleLike, onAgregarRespuesta }) => {
  const { user } = useAuth();
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const categoria = categorias.find(c => c.value === post.categoria);
  const userLiked = post.likes?.includes(user.id) || false;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-info">
          <span className="post-categoria">{categoria?.label}</span>
          <h3>{post.titulo}</h3>
          <div className="post-meta">
            <span>👤 {post.autor}</span>
            <span>📅 {new Date(post.fecha).toLocaleString('es-ES')}</span>
          </div>
        </div>
        <button
          className={`like-btn ${userLiked ? 'liked' : ''}`}
          onClick={() => onToggleLike(post.id)}
        >
          ❤️ {post.likes?.length || 0}
        </button>
      </div>

      <div className="post-contenido">
        <p>{post.contenido}</p>
        
        {post.archivos && post.archivos.length > 0 && (
          <div className="post-archivos" style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#333' }}>
              📎 Archivos Adjuntos ({post.archivos.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {post.archivos.map((archivo) => (
                <div key={archivo.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {archivo.tipo?.includes('pdf') ? '📄' :
                       archivo.tipo?.includes('word') ? '📝' :
                       archivo.tipo?.includes('excel') ? '📊' :
                       archivo.tipo?.includes('powerpoint') ? '📽️' :
                       archivo.tipo?.includes('image') ? '🖼️' :
                       archivo.tipo?.includes('zip') || archivo.tipo?.includes('rar') ? '📦' :
                       '📎'}
                    </span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{archivo.nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {(archivo.tamaño / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = archivo.contenido;
                      link.download = archivo.nombre;
                      link.click();
                    }}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                  >
                    ⬇️ Descargar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="post-acciones">
        <button
          className="btn-respuesta"
          onClick={() => setMostrarRespuestas(!mostrarRespuestas)}
        >
          💬 {post.respuestas?.length || 0} Respuestas
        </button>
      </div>

      {mostrarRespuestas && (
        <div className="respuestas-section">
          <div className="respuestas-list">
            {post.respuestas?.length > 0 ? (
              post.respuestas.map((respuesta) => (
                <div key={respuesta.id} className="respuesta-item">
                  <div className="respuesta-header">
                    <strong>{respuesta.autor}</strong>
                    <span>{new Date(respuesta.fecha).toLocaleString('es-ES')}</span>
                  </div>
                  <p>{respuesta.contenido}</p>
                </div>
              ))
            ) : (
              <p className="sin-respuestas">No hay respuestas aún</p>
            )}
          </div>

          <div className="nueva-respuesta">
            <textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder="Escribe una respuesta..."
              rows="3"
            />
            <button
              className="btn-enviar-respuesta"
              onClick={() => {
                if (nuevaRespuesta.trim()) {
                  onAgregarRespuesta(post.id, nuevaRespuesta);
                  setNuevaRespuesta('');
                }
              }}
              disabled={!nuevaRespuesta.trim()}
            >
              Enviar Respuesta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;

