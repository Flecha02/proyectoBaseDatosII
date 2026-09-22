'use client';

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';

interface Proveedor {
  idProveedor: number;
  nitProveedor: string;
  nombreProveedor: string;
  telefonoProveedor?: string;
  direccionProveedor?: string;
}

export default function GestionProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Proveedor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombreProveedor: '',
    nitProveedor: '',
    telefonoProveedor: '',
    direccionProveedor: '',
  });

  const cargarProveedores = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Proveedor[]>('/proveedores');
      setProveedores(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar la lista de proveedores');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setFormData({
      nombreProveedor: '',
      nitProveedor: '',
      telefonoProveedor: '',
      direccionProveedor: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Proveedor) => {
    setEditingSupplier(supplier);
    setFormData({
      nombreProveedor: supplier.nombreProveedor || '',
      nitProveedor: supplier.nitProveedor || '',
      telefonoProveedor: supplier.telefonoProveedor || '',
      direccionProveedor: supplier.direccionProveedor || '',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingSupplier) {
        // Editar Proveedor (PUT)
        await api.put(`/proveedores/${editingSupplier.idProveedor}`, formData);
      } else {
        // Crear Proveedor (POST)
        await api.post('/proveedores', formData);
      }
      setIsModalOpen(false);
      await cargarProveedores();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Error al guardar el proveedor');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await api.delete(`/proveedores/${id}`);
        setProveedores((prev) => prev.filter((p) => p.idProveedor !== id));
      } catch (err) {
        if (err instanceof ApiError) {
          alert(err.message);
        } else {
          alert('Error al eliminar el proveedor');
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
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Proveedores</h1>
            <p className="text-sm text-slate-500">Administra los distribuidores de insumos y materia prima</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Nuevo Proveedor
          </button>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={cargarProveedores}
              className="underline text-xs font-semibold ml-4 hover:text-red-900"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* TABLA DE PROVEEDORES */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-yellow-200 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nombre / Empresa</th>
                  <th className="px-6 py-4">NIT</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Dirección</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      Cargando proveedores desde la base de datos...
                    </td>
                  </tr>
                ) : proveedores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No hay proveedores registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  proveedores.map((supplier) => (
                    <tr key={supplier.idProveedor} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{supplier.nombreProveedor}</td>
                      <td className="px-6 py-4 font-mono text-xs">{supplier.nitProveedor}</td>
                      <td className="px-6 py-4">{supplier.telefonoProveedor || '-'}</td>
                      <td className="px-6 py-4 text-slate-600">{supplier.direccionProveedor || '-'}</td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(supplier)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.idProveedor)}
                          className="text-rose-600 hover:text-rose-800 font-medium text-xs px-2 py-1 rounded hover:bg-rose-50"
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
                {editingSupplier ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre o Empresa</label>
                  <input
                    type="text"
                    name="nombreProveedor"
                    value={formData.nombreProveedor}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Distribuidora Química"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">NIT</label>
                    <input
                      type="text"
                      name="nitProveedor"
                      value={formData.nitProveedor}
                      onChange={handleChange}
                      required
                      placeholder="Ej. 1234567-8"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      name="telefonoProveedor"
                      value={formData.telefonoProveedor}
                      onChange={handleChange}
                      placeholder="Ej. 2222-0000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccionProveedor"
                    value={formData.direccionProveedor}
                    onChange={handleChange}
                    placeholder="Ej. Calzada Roosevelt 12-45"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
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
                    {submitting ? 'Guardando...' : editingSupplier ? 'Guardar Cambios' : 'Crear Proveedor'}
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