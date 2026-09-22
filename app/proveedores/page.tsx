'use client';

import { useState } from 'react';

// Datos iniciales de prueba (Mock Data)
const INITIAL_SUPPLIERS = [
  { id: 1, nombre: 'Pinturas Químicas de Guatemala', nit: '1234567-8', telefono: '2222-1111', direccion: 'Calzada Roosevelt 12-45, Zona 11' },
  { id: 2, nombre: 'Solventes & Químicos Industriales', nit: '8765432-1', telefono: '2333-4444', direccion: 'Km 15.5 Carretera al Pacífico' },
  { id: 3, nombre: 'Importadora de Brochas y Rodillos', nit: '9988776-5', telefono: '2444-5555', direccion: 'Avenida Petapa 34-10, Zona 12' },
  { id: 4, nombre: 'Barnices y Acabados de Madera', nit: 'CF', telefono: '2555-6666', direccion: 'Zona Industrial, Quetzaltenango' },
];

export default function GestionProveedoresPage() {
  const [proveedores, setProveedores] = useState(INITIAL_SUPPLIERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    telefono: '',
    direccion: '',
  });

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setFormData({ nombre: '', nit: '', telefono: '', direccion: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      nombre: supplier.nombre,
      nit: supplier.nit,
      telefono: supplier.telefono,
      direccion: supplier.direccion,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingSupplier) {
      // Editar Proveedor
      setProveedores((prev) =>
        prev.map((p) => (p.id === editingSupplier.id ? { ...p, ...formData } : p))
      );
    } else {
      // Crear Proveedor
      const newSupplier = { id: Date.now(), ...formData };
      setProveedores((prev) => [...prev, newSupplier]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      setProveedores((prev) => prev.filter((p) => p.id !== id));
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
                {proveedores.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{supplier.nombre}</td>
                    <td className="px-6 py-4 font-mono text-xs">{supplier.nit}</td>
                    <td className="px-6 py-4">{supplier.telefono}</td>
                    <td className="px-6 py-4 text-slate-600">{supplier.direccion}</td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(supplier)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="text-rose-600 hover:text-rose-800 font-medium text-xs px-2 py-1 rounded hover:bg-rose-50"
                      >
                        Eliminar
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
                {editingSupplier ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre o Empresa</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
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
                      name="nit"
                      value={formData.nit}
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
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="Ej. 2222-0000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
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
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
                  >
                    {editingSupplier ? 'Guardar Cambios' : 'Crear Proveedor'}
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