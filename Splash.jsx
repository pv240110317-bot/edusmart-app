import { useEffect, useState } from 'react';
import './Splash.css';

const Splash = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Transición de entrada
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Después de la animación de salida, llamar onComplete
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2000); // Mostrar splash por 2 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-container ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="splash-content">
        <div className="logo-container">
          <div className="logo-icon">
            <div className="logo-square outer"></div>
            <div className="logo-square inner"></div>
          </div>
        </div>
        <h1 className="splash-title">eduSmart</h1>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Splash;

