'use client';

import React from "react";

export default function ClientesPage() {
  // Datos de ejemplo estáticos para la tabla
  const ventas = [
    {
      cliente: "Juan Pérez",
      email: "juan@example.com",
      producto: "Whisky Jack Daniels",
      precio: "120.00",
      cantidad: 2,
      totalVenta: "240.00",
    },
    {
      cliente: "María Gómez",
      email: "maria@example.com",
      producto: "Ron Appleton",
      precio: "95.50",
      cantidad: 1,
      totalVenta: "95.50",
    },
  ];

  return (
    <div className="p-4">
      <h3>Historial de ventas</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Cliente</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Producto</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Precio</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Cantidad</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{venta.cliente}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{venta.email}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{venta.producto}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>S/.{venta.precio}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{venta.cantidad}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>S/.{venta.totalVenta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
