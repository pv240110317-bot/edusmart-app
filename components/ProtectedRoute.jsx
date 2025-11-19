import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, tieneAcceso, isAdmin } = useAuth();

  if (loading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario está bloqueado
  if (user.bloqueado) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#dc2626'
      }}>
        <h2>⛔ Cuenta Bloqueada</h2>
        <p>Tu cuenta ha sido bloqueada. Contacta al administrador.</p>
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/#/login';
          }}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Verificar si tiene acceso activo (excepto para usuarios de ejemplo y admins)
  if (!tieneAcceso() && !user.esEjemplo && !isAdmin()) {
    return <Navigate to="/planes" replace />;
  }

  return children;
};

export default ProtectedRoute;

