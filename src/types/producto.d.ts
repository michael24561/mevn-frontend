// src/types/producto.d.ts
export interface Producto {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: string; // En frontend se recibe como string (ObjectId serializado)
  proveedor: string;
  imagen?: string; // URL de la imagen del producto
  // Campos poplados si usas .populate():
  categoria_nombre?: string; // Si haces populate
  proveedor_nombre?: string;
}