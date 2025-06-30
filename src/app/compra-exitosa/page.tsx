'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaCheckCircle, FaPrint, FaHome, FaShoppingBag, FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

export default function CompraExitosa() {
  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const ventaId = searchParams?.get('id');
  const facturaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obtenerVenta = async () => {
      if (!ventaId) {
        setError('No se encontró el ID de venta en la URL');
        setLoading(false);
        return;
      }

      if (status === 'unauthenticated') {
        setError('Debes iniciar sesión para ver esta información');
        setLoading(false);
        return;
      }

      if (status === 'loading') return;

      if (!session?.user?.id) {
        setError('No se pudo obtener la información de tu sesión');
        setLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/ventas/${ventaId}?clienteId=${session.user.id}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Error ${response.status}`);
        }

        const data = await response.json();
        setVenta(data.data || data);
      } catch (err: any) {
        console.error('Error al obtener venta:', err);
        setError(`Error al cargar los detalles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    obtenerVenta();
  }, [ventaId, session, status]);

  const handlePrint = () => {
    window.print();
  };

  const descargarPDF = async () => {
    if (!facturaRef.current) return;

    try {
      toast.info('Generando PDF...', { autoClose: 2000 });
      
      const canvas = await html2canvas(facturaRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        ignoreElements: (element) => element.classList.contains('no-pdf')
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.setProperties({
        title: `Factura ${venta.codigoVenta || venta._id.substring(0, 8)}`,
        subject: 'Factura de compra',
        author: 'Licorería Premium',
      });
      
      pdf.save(`factura-${venta.codigoVenta || venta._id.substring(0, 8)}.pdf`);
      toast.success('Factura descargada como PDF');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando detalles de tu compra...</p>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <h2>No se encontró la información de la compra</h2>
          <p className="lead">Detalles del problema:</p>
          <div className="alert alert-warning">
            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {error || 'Error desconocido'}
            </pre>
          </div>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link href="/" className="btn btn-primary">
              <FaHome className="me-2" />
              Ir al inicio
            </Link>
            <Link href="/tienda" className="btn btn-success">
              <FaShoppingBag className="me-2" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card border-success" ref={facturaRef}>
        <div className="card-header bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <FaCheckCircle className="me-2" />
              ¡Compra realizada con éxito!
            </h2>
            <div className="d-flex gap-2">
              <button onClick={handlePrint} className="btn btn-light btn-sm">
                <FaPrint className="me-1" />
                Imprimir
              </button>
              <button onClick={descargarPDF} className="btn btn-light btn-sm">
                <FaFilePdf className="me-1" />
                PDF
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Licorería Premium</h4>
              <p className="mb-1">Calle Falsa 123, Ciudad</p>
              <p className="mb-1">Teléfono: (123) 456-7890</p>
              <p className="mb-1">NIT: 123456789-0</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h4>Factura #{venta.codigoVenta || venta._id.substring(18, 24).toUpperCase()}</h4>
              <p className="mb-1"><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
              <p className="mb-1"><strong>Hora:</strong> {new Date(venta.fecha).toLocaleTimeString()}</p>
              <p className="mb-1"><strong>Cliente:</strong> {venta.cliente.nombre}</p>
            </div>
          </div>

          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Precio Unitario</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.items.map((item) => (
                  <tr key={item.producto._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.producto.imagen && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.producto.imagen.startsWith('/') ? '' : '/'}${item.producto.imagen}`}
                            alt={item.producto.nombre}
                            className="img-thumbnail me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/imagenes/licor-default.jpg';
                            }}
                          />
                        )}
                        {item.producto.nombre}
                      </div>
                    </td>
                    <td className="text-end">${item.precioUnitario.toFixed(2)}</td>
                    <td className="text-end">{item.cantidad}</td>
                    <td className="text-end">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">Total:</td>
                  <td className="text-end fw-bold">${venta.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Método de Pago</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Tipo:</strong> Efectivo</p>
                  <p className="mb-0"><strong>Estado:</strong> En proceso</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Información Adicional</h5>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>N° de Transacción:</strong> {venta._id.substring(10, 18).toUpperCase()}</p>
                  <p className="mb-0"><strong>Email de confirmación enviado a:</strong> {venta.cliente.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-5 print-hide no-pdf">
            <Link href="/" className="btn btn-primary">
              <FaHome className="me-2" />
              Ir al inicio
            </Link>
            <Link href="/tienda" className="btn btn-success">
              <FaShoppingBag className="me-2" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .card, .card * {
            visibility: visible;
          }
          .card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          .print-hide, .no-pdf {
            display: none !important;
          }
          
          /* Optimización para impresión/PDF */
          .card-header {
            padding: 10px;
          }
          h2 {
            font-size: 18px;
          }
          h4 {
            font-size: 16px;
          }
          table {
            font-size: 12px;
          }
          img {
            max-width: 40px;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}