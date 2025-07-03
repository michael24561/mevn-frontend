'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Venta {
  _id: string;
  items: {
    producto: {
      nombre: string;
      precio: number;
    };
    cantidad: number;
    subtotal: number;
  }[];
  total: number;
  fecha: string;
}

export default function OrdenConfirmadaPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const cargarVenta = async () => {
    try {
      // Cambia esta línea para usar la ruta correcta
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ventas/${id}`);
      
      // Agrega logs para debug
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) throw new Error(data.message || 'Error al cargar la orden');
      
      setVenta(data.data);
    } catch (error) {
      console.error('Error completo:', error);
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Error al cargar la orden';
      toast.error(errorMessage);
      router.push('/');
    }
  };

  cargarVenta();
}, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="container py-5 text-center">
        <h2>Orden no encontrada</h2>
        <Link href="/" className="btn btn-primary mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card p-4 text-center">
        <h1 className="text-success mb-4">¡Compra exitosa!</h1>
        <p className="lead">Tu orden #<strong>{id}</strong> ha sido confirmada.</p>
        
        <div className="mt-4 text-start">
          <h4>Detalles:</h4>
          <ul className="list-group mb-3">
            {venta.items.map((item, index) => (
              <li key={index} className="list-group-item">
                {item.producto.nombre} - {item.cantidad} x ${item.producto.precio.toFixed(2)}
                <span className="float-end">${item.subtotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <h5 className="text-end">Total: <strong>${venta.total.toFixed(2)}</strong></h5>
        </div>

        <div className="mt-4">
          <Link href="/mis-ordenes" className="btn btn-primary me-2">
            Ver mis pedidos
          </Link>
          <Link href="/shop" className="btn btn-outline-secondary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}