'use client';

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';

interface Producto {
  idProducto: number;
  codigoProducto: string;
  nombreProducto: string;
  marcaProducto?: string;
  colorProducto?: string;
  precioVentaProducto: number | string;
  stockMinimoProducto: number;
  idCategoria?: number;
  nombreCategoria?: string;
  idMedidaPresentacion?: number;
  descripcionMedida?: string;
}

export default function GestionProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para Crear / Editar
  const [formData, setFormData] = useState({
    codigoProducto: '',
    nombreProducto: '',
    marcaProducto: 'Corona',
    colorProducto: '',
    idCategoria: 1,
    idMedidaPresentacion: 1,
    precioVentaProducto: '',
    stockMinimoProducto: '',
  });

  const cargarProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Producto[]>('/productos');
      setProductos(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar catálogo de productos');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Función para determinar el color de la etiqueta de stock 
  const getStockBadgeClass = (stock: number) => {
    if (stock >= 100) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (stock >= 50 && stock < 100) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      codigoProducto: `PROD-${Date.now().toString().slice(-4)}`,
      nombreProducto: '',
      marcaProducto: 'Corona',
      colorProducto: '',
      idCategoria: 1,
      idMedidaPresentacion: 1,
      precioVentaProducto: '',
      stockMinimoProducto: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Producto) => {
    setEditingProduct(product);
    setFormData({
      codigoProducto: product.codigoProducto || '',
      nombreProducto: product.nombreProducto || '',
      marcaProducto: product.marcaProducto || '',
      colorProducto: product.colorProducto || '',
      idCategoria: product.idCategoria || 1,
      idMedidaPresentacion: product.idMedidaPresentacion || 1,
      precioVentaProducto: String(product.precioVentaProducto || ''),
      stockMinimoProducto: String(product.stockMinimoProducto || '0'),
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProduct) {
        // En el backend, el PUT actualiza únicamente precio y stock mínimo
        await api.put(`/productos/${editingProduct.idProducto}`, {
          precioVentaProducto: parseFloat(formData.precioVentaProducto),
          stockMinimoProducto: parseInt(formData.stockMinimoProducto, 10),
        });
      } else {
        // En el backend, el POST crea un nuevo producto
        await api.post('/productos', {
          idCategoria: Number(formData.idCategoria),
          idMedidaPresentacion: Number(formData.idMedidaPresentacion),
          codigoProducto: formData.codigoProducto,
          nombreProducto: formData.nombreProducto,
          marcaProducto: formData.marcaProducto,
          colorProducto: formData.colorProducto || null,
          precioVentaProducto: parseFloat(formData.precioVentaProducto),
          stockMinimoProducto: parseInt(formData.stockMinimoProducto || '0', 10),
        });
      }

      setIsModalOpen(false);
      await cargarProductos();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Error al guardar el producto');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        setProductos((prev) => prev.filter((p) => p.idProducto !== id));
      } catch (err) {
        if (err instanceof ApiError) {
          alert(err.message);
        } else {
          alert('Error al eliminar el producto');
        }
      }
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

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={cargarProductos}
              className="underline text-xs font-semibold ml-4 hover:text-red-900"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* TABLA DE PRODUCTOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-blue-200 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Presentación</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock Mínimo</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                      Cargando productos desde la base de datos...
                    </td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No hay productos registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  productos.map((product) => (
                    <tr key={product.idProducto} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{product.codigoProducto}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {product.nombreProducto}
                        {product.marcaProducto && (
                          <span className="block text-xs font-normal text-slate-400">
                            Marca: {product.marcaProducto}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {product.descripcionMedida || 'Estándar'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        Q{Number(product.precioVentaProducto || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStockBadgeClass(product.stockMinimoProducto)}`}>
                          {product.stockMinimoProducto} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.idProducto)}
                          className="text-rose-600 hover:text-rose-800 font-medium text-xs px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL CREAR / EDITAR */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                {editingProduct ? 'Editar Precio y Stock' : 'Crear Nuevo Producto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingProduct && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Código</label>
                        <input
                          type="text"
                          name="codigoProducto"
                          value={formData.codigoProducto}
                          onChange={handleChange}
                          required
                          placeholder="PROD-001"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Marca</label>
                        <input
                          type="text"
                          name="marcaProducto"
                          value={formData.marcaProducto}
                          onChange={handleChange}
                          required
                          placeholder="Ej. Corona"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Producto</label>
                      <input
                        type="text"
                        name="nombreProducto"
                        value={formData.nombreProducto}
                        onChange={handleChange}
                        required
                        placeholder="Ej. Pintura Látex Blanco"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Categoría</label>
                        <select
                          name="idCategoria"
                          value={formData.idCategoria}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm bg-white"
                        >
                          <option value={1}>Pinturas</option>
                          <option value={2}>Solventes</option>
                          <option value={3}>Barnices</option>
                          <option value={4}>Accesorios</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Presentación</label>
                        <select
                          name="idMedidaPresentacion"
                          value={formData.idMedidaPresentacion}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm bg-white"
                        >
                          <option value={1}>Galón</option>
                          <option value={2}>Cubeta</option>
                          <option value={3}>1/4 de Galón</option>
                          <option value={4}>1/2 Galón</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {editingProduct && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Producto:</p>
                    <p className="text-sm font-semibold text-slate-800">{editingProduct.nombreProducto}</p>
                    <p className="text-xs text-slate-400">Código: {editingProduct.codigoProducto}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Precio (Q)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="precioVentaProducto"
                      value={formData.precioVentaProducto}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Stock Mínimo</label>
                    <input
                      type="number"
                      name="stockMinimoProducto"
                      value={formData.stockMinimoProducto}
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
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-medium transition-colors"
                  >
                    {submitting ? 'Guardando...' : editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
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