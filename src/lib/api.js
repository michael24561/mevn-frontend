// src/lib/api.js
/**
 * @typedef {Object} Producto
 * @property {string} _id
 * @property {string} nombre
 * @property {number} precio
 * @property {string} [descripcion]
 * @property {string} [imagen]
 * @property {string} categoria
 * @property {string} proveedor
 * @property {number} stock
 */

/**
 * @returns {Promise<Producto[]>}
 */
export const getProductos = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/productos');
    if (!res.ok) throw new Error('Error al obtener productos');
    return /** @type {Producto[]} */ (await res.json());
  } catch (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
};