'use client';

import React from "react";

export default function PanelPage() {
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
          {/* Aquí irán las filas dinámicas de ventas */}
          <tr>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Juan Pérez</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>juan@example.com</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Pizza Pepperoni</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>S/.25</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>2</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>S/.50</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Ana Torres</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>ana@example.com</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Pizza Hawaiana</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>S/.22</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>1</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>S/.22</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
