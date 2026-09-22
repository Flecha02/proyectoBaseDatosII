'use client';

import { useState } from 'react';

// Datos de prueba iniciales
const INITIAL_PRODUCTS = [
  { id: 1, nombre: 'Pintura Látex Brocha de Oro - Blanco', presentacion: 'Galón', precio: 150.00, stock: 120 },
  { id: 2, nombre: 'Esmalte Anticorrosivo - Azul Naval', presentacion: 'Cubeta', precio: 650.00, stock: 75 },
  { id: 3, nombre: 'Barniz para Madera - Transparente', presentacion: '1/4 de Galón', precio: 45.00, stock: 30 },
  { id: 4, nombre: 'Sellador de Muros 100% Acrílico', presentacion: 'Medio Galón', precio: 85.00, stock: 0 },
];

export default function GestionProductosPage() {
  const [productos, setProductos] = useState(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    presentacion: 'Galón',
    precio: '',
    stock: '',
  });

  // Función para determinar el color de la etiqueta de stock 
  const getStockBadgeClass = (stock) => {
    if (stock >= 100) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Verde 100 o mas
    } else if (stock >= 50 && stock <= 90) {
      return 'bg-amber-50 text-amber-700 border-amber-200'; // Amarillo de 90 a 50
    } else {
      return 'bg-rose-50 text-rose-700 border-rose-200'; // Rojo (0 a 40 y rangos de alerta)
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', presentacion: 'Galón', precio: '', stock: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      presentacion: product.presentacion,
      precio: product.precio,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
    };

    if (editingProduct) {
      // Actualizar producto
      setProductos((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formattedData } : p))
      );
    } else {
      // Crear nuevo producto
      const newProduct = { id: Date.now(), ...formattedData };
      setProductos((prev) => [...prev, newProduct]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO CON BORDE AMARILLO Y BOTÓN CREAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="border-l-4 border-amber-400 pl-3">
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>
            <p className="text-sm text-slate-500">Administra el catálogo de pinturas, presentaciones y niveles de stock</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Nuevo Producto
          </button>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-blue-200 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Presentación</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productos.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{product.nombre}</td>
                    <td className="px-6 py-4 text-slate-600">{product.presentacion}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      Q{product.precio.toFixed(2)}
                    </td>
                    
                  {/* COLUMNA STOCK CON INDICADOR EN UNA SOLA LÍNEA */}
                <td className="px-6 py-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStockBadgeClass(product.stock)}`}>
                     {product.stock} unidades
                 </span>
                </td>

                    {/* COLUMNA DE ACCIONES SOLO CON EDITAR */}
            <td className="px-6 py-4 text-right">
         <button
             onClick={() => handleOpenEditModal(product)}
                className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
             >
             Editar
            </button>
            </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL CREAR / EDITAR */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Pintura Látex Blanco"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Presentación</label>
                  <select
                    name="presentacion"
                    value={formData.presentacion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm bg-white"
                  >
                    <option value ="1/32 de galón">1/32 de galón</option>
                    <option value="1/16 de galón">1/16 de galón</option>
                    <option value="1/8 de galón">1/8 de galón</option>
                    <option value="1/4 de galón">1/4 de galón</option>
                    <option value ="1/2 de galón">1/2 de galón</option>
                    <option value="Galón">Galón</option>
                    <option value="Cubeta">Cubeta</option>
                    
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Precio (Q)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      placeholder="Cantidad"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>
                </div>

                {/* BOTONES DEL MODAL */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
                  >
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}