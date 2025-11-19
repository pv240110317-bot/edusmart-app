import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Usuarios por defecto (siempre tienen acceso gratis)
const DEFAULT_USERS = [
  {
    id: '1',
    username: 'leonardo',
    password: '123',
    email: 'leonardo@vallarta.tecmm.edu.mx',
    role: 'admin',
    bloqueado: false,
    activo: true,
    plan: 'gratis',
    esEjemplo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'raul',
    password: '123',
    email: 'raul@vallarta.tecmm.edu.mx',
    role: 'estudiante',
    bloqueado: false,
    activo: true,
    plan: 'gratis',
    esEjemplo: true,
    especialidad: 'Ingeniería en Sistemas',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'alan',
    password: '123',
    email: 'alan@vallarta.tecmm.edu.mx',
    role: 'maestro',
    bloqueado: false,
    activo: true,
    plan: 'gratis',
    esEjemplo: true,
    createdAt: new Date().toISOString(),
  },
];

// Inicializar usuarios si no existen
const initializeUsers = () => {
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  const users = JSON.parse(existingUsers);
  
  // Asegurar que los usuarios por defecto existan
  const defaultUsernames = DEFAULT_USERS.map(u => u.username);
  const existingUsernames = users.map(u => u.username);
  
  DEFAULT_USERS.forEach(defaultUser => {
    if (!existingUsernames.includes(defaultUser.username)) {
      users.push(defaultUser);
    } else {
      // Actualizar usuario existente para mantener el rol correcto
      const index = users.findIndex(u => u.username === defaultUser.username);
      if (index !== -1) {
        users[index] = { ...users[index], role: defaultUser.role, password: defaultUser.password };
      }
    }
  });
  
  localStorage.setItem('users', JSON.stringify(users));
  return users;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Inicializar usuarios al cargar
  useEffect(() => {
    const initializedUsers = initializeUsers();
    setUsers(initializedUsers);
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Buscar el usuario actualizado en la lista
      const updatedUser = initializedUsers.find(u => u.id === userData.id || u.username === userData.username);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  // Crear nuevo usuario (por defecto es estudiante)
  const createUser = (username, password, email) => {
    const esCorreoValido = email?.includes('@vallarta.tecmm.edu.mx');
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email: email || '',
      password: password || '123',
      role: 'estudiante',
      bloqueado: false,
      activo: esCorreoValido, // Activo automáticamente si tiene correo institucional
      plan: esCorreoValido ? 'gratis' : null, // Plan gratis si tiene correo institucional
      esEjemplo: false,
      especialidad: null, // Se puede configurar después
      fechaInicioPlan: esCorreoValido ? new Date().toISOString() : null,
      fechaFinPlan: null, // Acceso permanente para correos institucionales
      createdAt: new Date().toISOString(),
    };
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    allUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(allUsers));
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setUsers(allUsers);
    setUser(newUser);
    return newUser;
  };

  // Iniciar sesión
  const login = (username, password) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = allUsers.find(
      u => u.username === username && u.password === (password || '123')
    );
    
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    }
    return null;
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Verificar si el usuario existe
  const userExists = (username) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return allUsers.some(u => u.username === username);
  };

  // Obtener todos los usuarios (solo admin)
  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  // Cambiar rol de usuario (solo admin)
  const changeUserRole = (userId, newRole) => {
    if (user?.role !== 'admin') {
      return false;
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Si el usuario modificado es el actual, actualizar estado
    if (user.id === userId) {
      const updatedUser = updatedUsers.find(u => u.id === userId);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return true;
  };

  // Verificar si es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Verificar si es maestro
  const isMaestro = () => {
    return user?.role === 'maestro';
  };

  // Verificar si es estudiante
  const isEstudiante = () => {
    return user?.role === 'estudiante';
  };

  // Bloquear/desbloquear usuario (solo admin)
  const toggleBloqueo = (userId) => {
    if (user?.role !== 'admin') {
      return false;
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return { ...u, bloqueado: !u.bloqueado };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    return true;
  };

  // Actualizar plan de usuario (solo admin)
  const actualizarPlanUsuario = (userId, nuevoPlan, fechaFin = null) => {
    if (user?.role !== 'admin') {
      return false;
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          plan: nuevoPlan,
          activo: true,
          fechaInicioPlan: new Date().toISOString(),
          fechaFinPlan: fechaFin || (nuevoPlan === 'porvida' ? null : u.fechaFinPlan),
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    return true;
  };

  // Verificar si el usuario tiene acceso activo
  const tieneAcceso = () => {
    if (!user) return false;
    if (user.esEjemplo) return true; // Usuarios de ejemplo siempre tienen acceso
    if (user.bloqueado) return false;
    
    // Plan por vida tiene acceso permanente
    if (user.plan === 'porvida') {
      return true;
    }
    
    // Correos @vallarta.tecmm.edu.mx tienen acceso gratis permanente
    if (user.email?.includes('@vallarta.tecmm.edu.mx')) {
      return true;
    }
    
    if (!user.activo) return false;
    
    // Verificar si el plan no ha expirado
    if (user.fechaFinPlan) {
      const fechaFin = new Date(user.fechaFinPlan);
      return fechaFin > new Date();
    }
    
    return false;
  };

  const value = {
    user,
    users,
    loading,
    createUser,
    login,
    logout,
    userExists,
    getAllUsers,
    changeUserRole,
    toggleBloqueo,
    actualizarPlanUsuario,
    isAdmin,
    isMaestro,
    isEstudiante,
    tieneAcceso,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

