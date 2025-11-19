import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import PostItem from './PostItem';
import './Foro.css';

const Foro = () => {
  const { user, isEstudiante } = useAuth();
  const { agregarAlHistorial } = useData();
  const [posts, setPosts] = useState(JSON.parse(localStorage.getItem('foro_posts') || '[]'));
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    categoria: 'general',
    archivos: [],
  });
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);

  const categorias = [
    { value: 'general', label: '💬 General' },
    { value: 'ayuda', label: '❓ Ayuda' },
    { value: 'estudio', label: '📚 Estudio' },
    { value: 'social', label: '👥 Social' },
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const archivosValidos = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const tiposPermitidos = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/zip',
        'application/x-rar-compressed',
      ];
      return file.size <= maxSize && tiposPermitidos.includes(file.type);
    });

    archivosValidos.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const archivoData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          nombre: file.name,
          tipo: file.type,
          tamaño: file.size,
          contenido: e.target.result,
          fecha: new Date().toISOString(),
        };
        setArchivosSeleccionados(prev => [...prev, archivoData]);
      };
      reader.readAsDataURL(file);
    });
  };

  const eliminarArchivo = (id) => {
    setArchivosSeleccionados(prev => prev.filter(arch => arch.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.titulo.trim() && formData.contenido.trim()) {
      const nuevoPost = {
        id: Date.now().toString(),
        autor: user.username,
        autorId: user.id,
        titulo: formData.titulo,
        contenido: formData.contenido,
        categoria: formData.categoria,
        archivos: archivosSeleccionados,
        fecha: new Date().toISOString(),
        respuestas: [],
        likes: [],
      };
      const nuevosPosts = [nuevoPost, ...posts];
      setPosts(nuevosPosts);
      localStorage.setItem('foro_posts', JSON.stringify(nuevosPosts));
      agregarAlHistorial('foro_post', `Publicaste en el foro: ${formData.titulo}`);
      setFormData({ titulo: '', contenido: '', categoria: 'general', archivos: [] });
      setArchivosSeleccionados([]);
      setMostrarFormulario(false);
    }
  };

  const agregarRespuesta = (postId, respuesta) => {
    const nuevosPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          respuestas: [
            ...post.respuestas,
            {
              id: Date.now().toString(),
              autor: user.username,
              contenido: respuesta,
              fecha: new Date().toISOString(),
            }
          ]
        };
      }
      return post;
    });
    setPosts(nuevosPosts);
    localStorage.setItem('foro_posts', JSON.stringify(nuevosPosts));
  };

  const toggleLike = (postId) => {
    const nuevosPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes || [];
        const userLiked = likes.includes(user.id);
        return {
          ...post,
          likes: userLiked 
            ? likes.filter(id => id !== user.id)
            : [...likes, user.id]
        };
      }
      return post;
    });
    setPosts(nuevosPosts);
    localStorage.setItem('foro_posts', JSON.stringify(nuevosPosts));
  };

  if (!isEstudiante()) {
    return (
      <div className="foro-container">
        <div className="foro-error">
          <h2>⛔ Acceso Restringido</h2>
          <p>El foro está disponible solo para estudiantes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="foro-container">
      <div className="foro-header">
        <h1>💬 Foro de Estudiantes</h1>
        <button 
          className="btn-nuevo-post"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Post'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-post">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Título de tu publicación"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Contenido *</label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                placeholder="Escribe tu publicación..."
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>📎 Archivos Adjuntos (PDF, Word, Excel, Imágenes, etc.)</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
                onChange={handleFileChange}
                className="file-input"
              />
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                Máximo 10MB por archivo. Formatos: PDF, Word, Excel, PowerPoint, Imágenes, TXT, ZIP, RAR
              </p>
              
              {archivosSeleccionados.length > 0 && (
                <div className="archivos-list" style={{ marginTop: '1rem' }}>
                  {archivosSeleccionados.map((archivo) => (
                    <div key={archivo.id} className="archivo-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <span>📎</span>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{archivo.nombre}</div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            {(archivo.tamaño / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarArchivo(archivo.id)}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.75rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-submit">Publicar</button>
          </form>
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No hay publicaciones aún</p>
            <p>¡Sé el primero en publicar!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              categorias={categorias}
              onToggleLike={toggleLike}
              onAgregarRespuesta={agregarRespuesta}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Foro;

