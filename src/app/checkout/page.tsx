'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface CarritoItem {
  _id: string;
  producto: {
    _id: string;
    nombre: string;
    precio: number;
    imagen?: string;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Carrito {
  _id: string;
  items: CarritoItem[];
  total: number;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCarrito = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/carritos?clienteId=${session.user.id}`);
        if (!res.ok) throw new Error('Error al cargar el carrito');
        
        const data = await res.json();
        setCarrito(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar el carrito');
      } finally {
        setLoading(false);
      }
    };

    cargarCarrito();
  }, [session]);

  const handleSuccess = (result: any) => {
    router.push(`/orden-confirmada/${result.venta._id}`);
  };

  if (!session) {
    return (
      <div className="container py-5 text-center">
        <h2>Debes iniciar sesión para continuar</h2>
        <Link href="/login" className="btn btn-primary mt-3">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!carrito || !carrito.items || carrito.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <Link href="/shop" className="btn btn-primary mt-3">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Finalizar Compra</h1>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Resumen de tu compra</h5>
              
              <ul className="list-group mb-3">
                {carrito.items.map(item => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between">
                    <div>
                      <strong>{item.producto.nombre}</strong>
                      <div className="text-muted small">
                        {item.cantidad} x ${item.precioUnitario.toFixed(2)}
                      </div>
                    </div>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>${carrito.total.toFixed(2)}</span>
                </li>
              </ul>
              
              {/* Aquí iría tu componente de pago */}
              <button 
                className="btn btn-success w-100 py-2"
                onClick={() => handleSuccess({ venta: { _id: 'simulada' } })}
              >
                Confirmar Compra (Simulación)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}