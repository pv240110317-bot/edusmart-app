import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Splash from './Splash';
import Login from './Login';
import Dashboard from './components/Dashboard';
import Materias from './components/Materias';
import Recursos from './components/Recursos';
import Citas from './components/Citas';
import Chat from './components/Chat';
import Examenes from './components/Examenes';
import Flashcards from './components/Flashcards';
import Historial from './components/Historial';
import Asesoria from './components/Asesoria';
import IA from './components/IA';
import Foro from './components/Foro';
import Perfil from './components/Perfil';
import Admin from './components/Admin';
import Planes from './components/Planes';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleSplashComplete = () => {
    setShowLogin(true);
  };

  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                !showLogin ? (
                  <Splash onComplete={handleSplashComplete} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          <Route path="/login" element={<Login />} />
          <Route path="/planes" element={<Planes />} />
          <Route
            path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="materias" element={<Materias />} />
              <Route path="recursos" element={<Recursos />} />
              <Route path="citas" element={<Citas />} />
              <Route path="chat" element={<Chat />} />
              <Route path="examenes" element={<Examenes />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="historial" element={<Historial />} />
              <Route path="asesoria" element={<Asesoria />} />
              <Route path="ia" element={<IA />} />
              <Route path="foro" element={<Foro />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

