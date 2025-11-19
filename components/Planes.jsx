import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Planes.css';

const Planes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  const planes = [
    {
      id: 'prueba',
      nombre: 'Plan de Prueba',
      precio: 'Gratis',
      duracion: '7 días',
      popular: false,
      caracteristicas: [
        '✅ Acceso completo por 7 días',
        '✅ Todas las funcionalidades',
        '✅ Sin restricciones',
        '✅ Soporte básico',
        '⏰ Después de 7 días requiere suscripción',
      ],
    },
    {
      id: 'mensual',
      nombre: 'Plan Mensual',
      precio: '$250',
      duracion: '1 mes',
      popular: true,
      caracteristicas: [
        '✅ Acceso completo ilimitado',
        '✅ Todas las funcionalidades',
        '✅ Exámenes ilimitados',
        '✅ Recursos premium',
        '✅ Soporte prioritario',
        '✅ Actualizaciones incluidas',
      ],
    },
    {
      id: 'anual',
      nombre: 'Plan Anual',
      precio: '$1,200',
      duracion: '1 año',
      popular: false,
      ahorro: 'Ahorra $1,800',
      caracteristicas: [
        '✅ Acceso completo ilimitado',
        '✅ Todas las funcionalidades',
        '✅ Exámenes ilimitados',
        '✅ Recursos premium',
        '✅ Soporte prioritario',
        '✅ Actualizaciones incluidas',
        '🎁 2 meses gratis',
        '🎁 Certificados digitales',
      ],
    },
  ];

  const seleccionarPlan = (planId) => {
    setPlanSeleccionado(planId);
    // Simular proceso de pago
    setTimeout(() => {
      // Aquí iría la lógica de pago real (Stripe, PayPal, etc.)
      if (planId !== 'prueba') {
        alert(`Plan ${planId} seleccionado.\n\nEn producción, aquí se procesaría el pago:\n- Mensual: $250 MXN\n- Anual: $1,200 MXN\n\nPor ahora, el plan se activará automáticamente.`);
      }
      
      // Actualizar usuario con el plan
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const esCorreoValido = user.email?.includes('@vallarta.tecmm.edu.mx');
      
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          const fechaInicio = new Date();
          let fechaFin;
          let planFinal = planId;
          
          if (planId === 'prueba') {
            fechaFin = new Date(fechaInicio.getTime() + 7 * 24 * 60 * 60 * 1000);
            // Si tiene correo válido, después de la prueba será gratis permanente
            if (esCorreoValido) {
              planFinal = 'gratis';
            }
          } else if (planId === 'mensual') {
            fechaFin = new Date(fechaInicio.getTime() + 30 * 24 * 60 * 60 * 1000);
          } else {
            fechaFin = new Date(fechaInicio.getTime() + 365 * 24 * 60 * 60 * 1000);
          }
          
          return {
            ...u,
            plan: planFinal,
            fechaInicioPlan: fechaInicio.toISOString(),
            fechaFinPlan: esCorreoValido && planId === 'prueba' ? null : fechaFin.toISOString(), // Gratis permanente si es correo válido
            activo: true,
          };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Recargar página para actualizar el contexto
      window.location.href = '/#/dashboard';
    }, 1000);
  };

  return (
    <div className="planes-container">
      <div className="planes-header">
        <h1>💎 Elige tu Plan</h1>
        <p>Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>

      <div className="planes-grid">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="badge-popular">Más Popular</div>}
            {plan.ahorro && <div className="badge-ahorro">{plan.ahorro}</div>}
            
            <div className="plan-header">
              <h2>{plan.nombre}</h2>
              <div className="plan-precio">
                <span className="precio">{plan.precio}</span>
                {plan.precio !== 'Gratis' && (
                  <span className="duracion">/{plan.duracion}</span>
                )}
              </div>
            </div>

            <ul className="plan-caracteristicas">
              {plan.caracteristicas.map((caracteristica, index) => (
                <li key={index}>{caracteristica}</li>
              ))}
            </ul>

            <button
              className={`btn-seleccionar ${plan.popular ? 'btn-popular' : ''}`}
              onClick={() => seleccionarPlan(plan.id)}
            >
              {plan.precio === 'Gratis' ? 'Comenzar Prueba' : 'Seleccionar Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="planes-info">
        <h3>ℹ️ Información Importante</h3>
        <ul>
          <li><strong>Correos @vallarta.tecmm.edu.mx:</strong> Tienen acceso gratuito permanente después de seleccionar el plan de prueba</li>
          <li><strong>Plan de Prueba:</strong> Válido por 7 días gratis, después requiere suscripción</li>
          <li><strong>Plan Mensual:</strong> $250 MXN/mes - Acceso completo</li>
          <li><strong>Plan Anual:</strong> $1,200 MXN/año - Ahorra $1,800, incluye certificados</li>
          <li>Puedes cancelar tu suscripción en cualquier momento</li>
          <li>Todos los planes incluyen todas las funcionalidades de la plataforma</li>
        </ul>
      </div>
    </div>
  );
};

export default Planes;

