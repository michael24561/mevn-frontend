'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ProductoCarrito {
  _id: string;
  nombre: string;
  precio: number;
  imagen?: string;
  stock: number;
}

interface ItemCarrito {
  _id: string;
  producto: ProductoCarrito;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Carrito {
  _id: string;
  items: ItemCarrito[];
  total: number;
  fecha_actualizacion: string;
}

export default function PaginaCarrito() {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const obtenerCarrito = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos?clienteId=${session.user.id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al obtener el carrito');
      }

      const data = await response.json();
      setCarrito(data);
    } catch (error: any) {
      console.error('Error obteniendo carrito:', error);
      toast.error(error.message);
      setCarrito(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, [session]);

  const actualizarCantidadItem = async (itemId: string, nuevaCantidad: number) => {
    if (!session?.user?.id || nuevaCantidad < 1) return;

    try {
      setProcesando(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cantidad: nuevaCantidad, 
          clienteId: session.user.id 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar cantidad');
      }

      const data = await response.json();
      setCarrito(data.carrito);
      toast.success('Cantidad actualizada');
    } catch (error: any) {
      console.error('Error actualizando cantidad:', error);
      toast.error(error.message);
    } finally {
      setProcesando(false);
    }
  };

  const eliminarItemCarrito = async (itemId: string) => {
    if (!session?.user?.id) return;

    try {
      setProcesando(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: session.user.id })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar item');
      }

      const data = await response.json();
      setCarrito(data.carrito);
      toast.success('Producto eliminado');
    } catch (error: any) {
      console.error('Error eliminando item:', error);
      toast.error(error.message);
    } finally {
      setProcesando(false);
    }
  };

  const procesarCompra = async () => {
    if (!session?.user?.id || !carrito) return;

    try {
      setProcesando(true);
      // 1. Procesar la venta
      const ventaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clienteId: session.user.id,
          items: carrito.items.map(item => ({
            productoId: item.producto._id,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario
          }))
        })
      });

      if (!ventaResponse.ok) {
        const errorText = await ventaResponse.text();
        throw new Error(errorText || 'Error al procesar venta');
      }

      const ventaData = await ventaResponse.json();
      const ventaId = ventaData._id || ventaData.data?._id;

      if (!ventaId) {
        throw new Error('No se recibió el ID de la venta');
      }

      // 2. Vaciar el carrito actual
      const vaciarResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: session.user.id })
      });

      if (!vaciarResponse.ok) {
        throw new Error('Error al vaciar el carrito después de la compra');
      }

      // 3. Redirigir a confirmación CON EL ID DE VENTA
      router.push(`/compra-exitosa?id=${ventaId}`);
      toast.success('Compra realizada con éxito!');
    } catch (error: any) {
      console.error('Error procesando compra:', error);
      toast.error(error.message);
    } finally {
      setProcesando(false);
    }
  };

  // ... (resto del componente permanece igual)

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando tu carrito...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-5 text-center">
        <h2>Debes iniciar sesión</h2>
        <p className="lead">Para ver tu carrito, por favor inicia sesión</p>
        <Link href="/auth/login" className="btn btn-success mt-3">
          Iniciar sesión
        </Link>
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
                    <img
                      src={
                        item.producto.imagen
                          ? `${process.env.NEXT_PUBLIC_API_URL}${item.producto.imagen.startsWith('/') ? '' : '/'}${item.producto.imagen}`
                          : '/imagenes/licor-default.jpg'
                      }
                      alt={item.producto.nombre}
                      className="img-fluid rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/imagenes/licor-default.jpg';
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="mb-1">{item.producto.nombre}</h5>
                    <p className="mb-0 text-muted">Stock: {item.producto.stock}</p>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => actualizarCantidadItem(item._id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1 || procesando}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.cantidad}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => actualizarCantidadItem(item._id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock || procesando}
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
                      onClick={() => eliminarItemCarrito(item._id)}
                      disabled={procesando}
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
              <button
                className="btn btn-success w-100 mt-3"
                onClick={procesarCompra}
                disabled={procesando}
              >
                {procesando ? 'Procesando...' : 'Proceder al Pago'}
              </button>
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