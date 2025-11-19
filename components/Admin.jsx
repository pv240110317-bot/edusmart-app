import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

const Admin = () => {
  const { getAllUsers, changeUserRole, toggleBloqueo, actualizarPlanUsuario, isAdmin } = useAuth();
  const [users, setUsers] = useState(getAllUsers().filter(u => !u.esEjemplo)); // Solo usuarios registrados
  const [mensaje, setMensaje] = useState('');
  const [mostrarSuscripciones, setMostrarSuscripciones] = useState(false);

  if (!isAdmin()) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <h2>⛔ Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p>Solo los administradores pueden gestionar usuarios.</p>
        </div>
      </div>
    );
  }

  const handleRoleChange = (userId, newRole) => {
    const success = changeUserRole(userId, newRole);
    if (success) {
      setUsers(getAllUsers().filter(u => !u.esEjemplo));
      setMensaje(`Rol actualizado exitosamente`);
      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('Error al actualizar el rol');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const handleToggleBloqueo = (userId) => {
    const usuarioActual = users.find(u => u.id === userId);
    const estabaBloqueado = usuarioActual?.bloqueado;
    const success = toggleBloqueo(userId);
    if (success) {
      setUsers(getAllUsers().filter(u => !u.esEjemplo));
      setMensaje(`Usuario ${estabaBloqueado ? 'desbloqueado' : 'bloqueado'} exitosamente`);
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const getPlanInfo = (user) => {
    if (user.plan === 'porvida') return { text: 'Por Vida', color: '#dc2626' };
    if (user.plan === 'gratis') return { text: 'Gratis', color: '#10b981' };
    if (user.plan === 'prueba') return { text: 'Prueba (7 días)', color: '#f59e0b' };
    if (user.plan === 'mensual') return { text: 'Mensual', color: '#2563eb' };
    if (user.plan === 'anual') return { text: 'Anual', color: '#8b5cf6' };
    return { text: 'Sin plan', color: '#999' };
  };

  const handlePlanChange = (userId, nuevoPlan) => {
    const success = actualizarPlanUsuario(userId, nuevoPlan);
    if (success) {
      setUsers(getAllUsers().filter(u => !u.esEjemplo));
      setMensaje(`Plan actualizado a: ${nuevoPlan === 'porvida' ? 'Por Vida' : nuevoPlan}`);
      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('Error al actualizar el plan');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: '👑 Administrador', color: '#dc2626' },
      maestro: { text: '👨‍🏫 Maestro', color: '#2563eb' },
      estudiante: { text: '🎓 Estudiante', color: '#10b981' },
    };
    return badges[role] || { text: role, color: '#666' };
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👑 Panel de Administración</h1>
        <p>Gestiona usuarios registrados, roles, bloqueos y suscripciones</p>
        <p className="admin-subtitle">Total de usuarios registrados: {users.length}</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setMostrarSuscripciones(!mostrarSuscripciones)}
            style={{
              padding: '0.75rem 1.5rem',
              background: mostrarSuscripciones ? '#2563eb' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {mostrarSuscripciones ? '👥 Ver Usuarios' : '💳 Administrar Suscripciones'}
          </button>
          <button
            onClick={() => {
              const todosLosUsuarios = getAllUsers().filter(u => !u.esEjemplo);
              todosLosUsuarios.forEach(u => {
                if (u.plan !== 'porvida') {
                  actualizarPlanUsuario(u.id, 'porvida');
                }
              });
              setUsers(getAllUsers().filter(u => !u.esEjemplo));
              setMensaje('Plan de por vida aplicado a todos los usuarios');
              setTimeout(() => setMensaje(''), 3000);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            ⭐ Plan Por Vida (Todos)
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`admin-mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      <div className="admin-users-list">
        <div className="users-table-header">
          <div className="col-usuario">Usuario / Correo</div>
          <div className="col-rol">Rol</div>
          <div className="col-plan">Plan</div>
          <div className="col-estado">Estado</div>
          <div className="col-acciones">Acciones</div>
        </div>

        {users.length === 0 ? (
          <div className="empty-users">
            <p>No hay usuarios registrados aún</p>
            <p>Los usuarios aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          users.map((userItem) => {
            const badge = getRoleBadge(userItem.role);
            const planInfo = getPlanInfo(userItem);
            return (
              <div key={userItem.id} className={`user-row ${userItem.bloqueado ? 'bloqueado' : ''}`}>
                <div className="col-usuario">
                  <strong>{userItem.username}</strong>
                  {userItem.email && (
                    <div className="user-email">{userItem.email}</div>
                  )}
                </div>
                <div className="col-rol">
                  <span className="role-badge" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>
                    {badge.text}
                  </span>
                </div>
                <div className="col-plan">
                  <span className="plan-badge" style={{ backgroundColor: `${planInfo.color}20`, color: planInfo.color }}>
                    {planInfo.text}
                  </span>
                  {mostrarSuscripciones && (
                    <select
                      value={userItem.plan || 'sinplan'}
                      onChange={(e) => handlePlanChange(userItem.id, e.target.value)}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '0.85rem',
                        width: '100%',
                      }}
                    >
                      <option value="sinplan">Sin plan</option>
                      <option value="gratis">Gratis</option>
                      <option value="prueba">Prueba (7 días)</option>
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                      <option value="porvida">⭐ Por Vida</option>
                    </select>
                  )}
                </div>
                <div className="col-estado">
                  {userItem.bloqueado ? (
                    <span className="estado-badge bloqueado-badge">🚫 Bloqueado</span>
                  ) : userItem.activo ? (
                    <span className="estado-badge activo-badge">✅ Activo</span>
                  ) : (
                    <span className="estado-badge inactivo-badge">⏸️ Inactivo</span>
                  )}
                </div>
                <div className="col-acciones">
                  <select
                    value={userItem.role}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="estudiante">🎓 Estudiante</option>
                    <option value="maestro">👨‍🏫 Maestro</option>
                    <option value="admin">👑 Administrador</option>
                  </select>
                  <button
                    className={`btn-bloquear ${userItem.bloqueado ? 'desbloquear' : ''}`}
                    onClick={() => handleToggleBloqueo(userItem.id)}
                  >
                    {userItem.bloqueado ? '🔓 Desbloquear' : '🔒 Bloquear'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-info">
        <h3>ℹ️ Información del Sistema</h3>
        <ul>
          <li><strong>👑 Administrador:</strong> Puede gestionar usuarios, cambiar roles y bloquear cuentas</li>
          <li><strong>👨‍🏫 Maestro:</strong> Puede crear materias, recursos y exámenes</li>
          <li><strong>🎓 Estudiante:</strong> Acceso estándar, puede ver contenido y usar el foro</li>
          <li><strong>Correos válidos:</strong> Solo @vallarta.tecmm.edu.mx tienen acceso gratis</li>
          <li><strong>Usuarios de ejemplo:</strong> leonardo, raul, alan (siempre tienen acceso gratis)</li>
          <li><strong>Nuevos usuarios:</strong> Deben seleccionar un plan si no tienen correo válido</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;

