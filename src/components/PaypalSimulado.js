'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function PaypalButton({ carrito, onSuccess }) {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimularPago = async () => {
    if (!session?.user?.id) {
      toast.error('Debes iniciar sesión para pagar');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Simular autenticación en PayPal
      toast.info('Redirigiendo a PayPal...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula redirección

      // 2. Mostrar confirmación simulada
      toast.info('Por favor confirma el pago en PayPal');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Simular pago exitoso
      const pagoSimulado = {
        id: `PAY-${Math.random().toString(36).substr(2, 12)}`,
        status: 'COMPLETED',
        amount: carrito.total,
        currency: 'USD',
        payer: {
          email: session.user.email
        }
      };

      // 4. Registrar la venta en tu backend
      const response = await fetch('http://localhost:5000/api/ventas/procesar-venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: session.user.id,
          metodoPago: 'paypal',
          datosPago: pagoSimulado
        })
      });

      if (!response.ok) throw new Error('Error al registrar la venta');

      const venta = await response.json();
      onSuccess(venta);

    } catch (error) {
      toast.error(error.message || 'Error en el proceso de pago');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleSimularPago}
      disabled={isProcessing}
      className="btn btn-primary w-100"
      style={{ backgroundColor: '#003087', color: 'white' }}
    >
      {isProcessing ? (
        <>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Procesando pago...
        </>
      ) : (
        <>
          <i className="fab fa-paypal me-2"></i>
          Pagar con PayPal (Simulación) ${carrito.total.toFixed(2)}
        </>
      )}
    </button>
  );
}