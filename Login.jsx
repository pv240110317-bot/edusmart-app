import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createUser, login, userExists } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      // Verificar si el usuario existe
      if (userExists(username)) {
        // Intentar iniciar sesión (contraseña por defecto es 123 si está vacía)
        const user = login(username, password || '123');
        if (user) {
          // Verificar si está bloqueado
          if (user.bloqueado) {
            setError('Tu cuenta ha sido bloqueada. Contacta al administrador.');
            setLoading(false);
            return;
          }
          navigate('/dashboard');
        } else {
          setError('Contraseña incorrecta');
        }
      } else {
        // Validar correo para nuevos usuarios
        if (!email.trim()) {
          setError('El correo electrónico es requerido para nuevos usuarios');
          setLoading(false);
          return;
        }

        // Verificar dominio del correo - SOLO se permiten @vallarta.tecmm.edu.mx
        const esCorreoValido = email.includes('@vallarta.tecmm.edu.mx');
        if (!esCorreoValido) {
          setError('Solo se permiten correos @vallarta.tecmm.edu.mx para registrarse');
          setLoading(false);
          return;
        }

        // Crear nuevo usuario
        const newUser = createUser(username, password || '123', email);
        
        // Usuarios con correo @vallarta.tecmm.edu.mx tienen acceso directo sin pasar por planes
        // esCorreoValido ya está definido arriba
        if (esCorreoValido) {
          // Activar acceso directo para usuarios institucionales
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const updatedUsers = users.map(u => {
            if (u.id === newUser.id) {
              return {
                ...u,
                activo: true,
                plan: 'gratis',
                fechaInicioPlan: new Date().toISOString(),
                fechaFinPlan: null, // Acceso permanente
              };
            }
            return u;
          });
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          const updatedUser = updatedUsers.find(u => u.id === newUser.id);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          navigate('/dashboard');
        } else {
          // Otros usuarios deben seleccionar un plan
          navigate('/planes');
        }
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="logo-container">
          <div className="logo-icon">
            <div className="logo-square outer"></div>
            <div className="logo-square inner"></div>
          </div>
        </div>
        <h1 className="login-title">eduSmart</h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          </div>

          {!userExists(username) && (
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo (@vallarta.tecmm.edu.mx)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required={!userExists(username)}
              />
            </div>
          )}
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          
          {error && (
            <div className="error-message" style={{
              color: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'PROCESANDO...' : 'INICIAR SESIÓN'}
          </button>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.85rem',
            marginTop: '1rem'
          }}>
            {userExists(username) 
              ? 'Usuario existente - Iniciar sesión (contraseña: 123)' 
              : 'Nuevo usuario - Requiere correo @vallarta.tecmm.edu.mx'}
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.75rem',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Correos @vallarta.tecmm.edu.mx: Acceso gratis permanente
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.7rem',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Usuarios ejemplo: leonardo (admin), raul (estudiante), alan (maestro)
          </p>

          {/* Botón de descarga de app Android */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              type="button"
              onClick={() => {
                // URL donde estará el APK
                const apkUrl = window.location.origin + '/eduSmart-1.0.0.apk';
                // Crear un enlace temporal para forzar la descarga
                const link = document.createElement('a');
                link.href = apkUrl;
                link.download = 'eduSmart-1.0.0.apk';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📱 Descargar App Android
            </button>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.7rem',
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              Versión interna - Solo para estudiantes y profesores
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

