import { useAuth } from '../contexts/AuthContext';
import './Perfil.css';

const Perfil = () => {
  const { user, isAdmin, isMaestro, isEstudiante } = useAuth();

  const getRoleInfo = () => {
    if (isAdmin()) return { text: '👑 Administrador', color: '#dc2626' };
    if (isMaestro()) return { text: '👨‍🏫 Maestro', color: '#2563eb' };
    if (isEstudiante()) return { text: '🎓 Estudiante', color: '#10b981' };
    return { text: 'Usuario', color: '#666' };
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="perfil-content">
        <div className="perfil-card">
          <div className="avatar-container">
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="perfil-info">
            <h2>Información Personal</h2>
            <div className="info-item">
              <label>Usuario:</label>
              <span>{user?.username}</span>
            </div>
            <div className="info-item">
              <label>Rol:</label>
              <span className="role-display" style={{ color: roleInfo.color, fontWeight: 600 }}>
                {roleInfo.text}
              </span>
            </div>
            <div className="info-item">
              <label>ID:</label>
              <span>{user?.id}</span>
            </div>
            <div className="info-item">
              <label>Miembro desde:</label>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="perfil-stats">
          <div className="stat-card">
            <h3>Sesiones de Asesoría</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Consultas de IA</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Recursos Descargados</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

