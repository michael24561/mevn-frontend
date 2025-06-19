'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react'; // Si usas NextAuth.js

interface CarritoItem {
  _id: string;
  producto: {
    _id: string;
    nombre: string;
    precio: number;
    imagen?: string;
    stock: number;
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

export default function PaginaCarrito() {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession(); // Obtiene la sesión del usuario (NextAuth.js)

  useEffect(() => {
    const obtenerCarrito = async () => {
      if (!session?.user?.id) return; // Si no hay usuario, no hacemos la petición

      try {
        const response = await fetch(`http://localhost:5000/api/carritos?clienteId=${session.user.id}`);
        if (!response.ok) throw new Error('Error al obtener el carrito');

        const data = await response.json();
        setCarrito(data);
      } catch (error: any) {
        toast.error(error.message || 'Error al cargar el carrito');
      } finally {
        setLoading(false);
      }
    };

    obtenerCarrito();
  }, [session]); // Dependencia: se ejecuta cuando cambia la sesión

  const actualizarCantidad = async (itemId: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1 || !session?.user?.id) return;

    try {
      const response = await fetch(`http://localhost:5000/api/carritos/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: nuevaCantidad, clienteId: session.user.id })
      });

      if (!response.ok) throw new Error('Error al actualizar la cantidad');

      const data = await response.json();
      setCarrito(data.carrito);
      toast.success('Cantidad actualizada');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar');
    }
  };

  const eliminarItem = async (itemId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`http://localhost:5000/api/carritos/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: session.user.id })
      });

      if (!response.ok) throw new Error('Error al eliminar el producto');

      const data = await response.json();
      setCarrito(data.carrito);
      toast.success('Producto eliminado del carrito');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  // Resto del código (UI) permanece igual...
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // ... El resto del código (UI) permanece igual ...


  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <p className="lead">Aún no has agregado productos a tu carrito</p>
        <Link href="/shop" className="btn btn-success mt-3">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Tu Carrito de Compras</h1>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              {carrito.items.map((item) => (
                <div key={item._id} className="row mb-4 align-items-center">
                  <div className="col-md-2">
  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
    <img
  src={
    item.producto.imagen
      ? `http://localhost:5000${item.producto.imagen.startsWith('/') ? '' : '/uploads/'}${item.producto.imagen}`
      : '/assets/img/licor_default.jpg'
  }
  alt={item.producto.nombre}
  style={{
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  }}
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/assets/img/licor_default.jpg';
  }}
/>
  </div>
</div>
                  <div className="col-md-4">
                    <h5 className="mb-1">{item.producto.nombre}</h5>
                    <p className="mb-0 text-muted">Stock: {item.producto.stock}</p>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => actualizarCantidad(item._id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.cantidad}</span>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => actualizarCantidad(item._id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="mb-0">${item.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="col-md-1 text-end">
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarItem(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Resumen del Pedido</h5>
              <ul className="list-group list-group-flush">
                {carrito.items.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between">
                    <span>
                      {item.producto.nombre} x {item.cantidad}
                    </span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>${carrito.total.toFixed(2)}</span>
                </li>
              </ul>
              <Link href="/checkout" className="btn btn-success w-100 mt-3">
                Proceder al Pago
              </Link>
              <Link href="/shop" className="btn btn-outline-secondary w-100 mt-2">
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}