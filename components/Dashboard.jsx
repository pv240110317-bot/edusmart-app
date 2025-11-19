import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const { isEstudiante } = useAuth();
  
  // Si es admin, solo mostrar el botón de administración
  const menuItems = isAdmin() 
    ? [
        { id: 'admin', label: '👑 Administración', path: '/dashboard/admin' },
      ]
    : [
        { id: 'materias', label: '📚 Mis Materias', path: '/dashboard/materias' },
        { id: 'recursos', label: '📄 Recursos', path: '/dashboard/recursos' },
        { id: 'citas', label: '📅 Agendar Cita', path: '/dashboard/citas' },
        { id: 'chat', label: '💬 Chat Profesores', path: '/dashboard/chat' },
        { id: 'examenes', label: '📝 Exámenes IA', path: '/dashboard/examenes' },
        { id: 'flashcards', label: '🎴 Flashcards', path: '/dashboard/flashcards' },
        { id: 'historial', label: '📊 Historial', path: '/dashboard/historial' },
        { id: 'asesoria', label: '🎓 Asesoría', path: '/dashboard/asesoria' },
        { id: 'ia', label: '🤖 IA Chat', path: '/dashboard/ia' },
        ...(isEstudiante() ? [{ id: 'foro', label: '💬 Foro Estudiantes', path: '/dashboard/foro' }] : []),
        { id: 'perfil', label: '👤 Mi Perfil', path: '/dashboard/perfil' },
      ];

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>eduSmart</h2>
          <p className="user-welcome">Bienvenido, {user?.username}</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {location.pathname === '/dashboard' ? (
            <div className="dashboard-welcome">
              {isAdmin() ? (
                <>
                  <h1>👑 Panel de Administración</h1>
                  <p>Gestiona usuarios, roles y configuraciones del sistema</p>
                  <div className="welcome-cards">
                    <div className="welcome-card" onClick={() => navigate('/dashboard/admin')}>
                      <h3>👑 Administración</h3>
                      <p>Gestiona usuarios registrados, roles y bloqueos</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1>Bienvenido a eduSmart</h1>
                  <p>Selecciona una opción del menú para comenzar</p>
                  <div className="welcome-cards">
                    <div className="welcome-card" onClick={() => navigate('/dashboard/materias')}>
                      <h3>📚 Mis Materias</h3>
                      <p>Gestiona tus materias y asignaturas</p>
                    </div>
                    <div className="welcome-card" onClick={() => navigate('/dashboard/recursos')}>
                      <h3>📄 Recursos</h3>
                      <p>Accede a recursos educativos</p>
                    </div>
                    <div className="welcome-card" onClick={() => navigate('/dashboard/examenes')}>
                      <h3>📝 Exámenes con IA</h3>
                      <p>Genera y realiza exámenes</p>
                    </div>
                    <div className="welcome-card" onClick={() => navigate('/dashboard/flashcards')}>
                      <h3>🎴 Flashcards</h3>
                      <p>Estudia con tarjetas interactivas</p>
                    </div>
                    <div className="welcome-card" onClick={() => navigate('/dashboard/citas')}>
                      <h3>📅 Agendar Cita</h3>
                      <p>Programa citas con profesores</p>
                    </div>
                    <div className="welcome-card" onClick={() => navigate('/dashboard/chat')}>
                      <h3>💬 Chat</h3>
                      <p>Chatea con tus profesores</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

