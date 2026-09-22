'use client';

import { useState } from 'react';

// Datos iniciales de prueba (Mock Data) enfocados en una distribuidora de pinturas
const INITIAL_CLIENTS = [
  { id: 1, nombre: 'Distribuidora El Pincel', nit: '1234567-8', telefono: '5555-0123', email: 'contacto@elpincel.com', direccion: 'Avenida 12, Zona 3 Ciudad Capital' },
  { id: 2, nombre: 'Constructora Horizon', nit: '8765432-1', telefono: '5555-9876', email: 'compras@horizon.com', direccion: 'Avenida 12, Zona 2 Solola' },
  { id: 3, nombre: 'Juan Carlos Ruiz', nit: 'CF', telefono: '5555-4321', email: 'juan.ruiz@gmail.com', direccion: 'Avenida 12, Zona 10 Quetzaltenango' },
];

export default function GestionClientesPage() {
  const [clientes, setClientes] = useState(INITIAL_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // null = Crear, objeto = Editar

  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    telefono: '',
    email: '',
    direccion: '', 
  });

  // Abrir modal para Crear
  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setFormData({ nombre: '', nit: '', telefono: '', email: '', direccion: '' });
    setIsModalOpen(true);
  };

  // Abrir modal para Editar
  const handleOpenEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre,
      nit: client.nit,
      telefono: client.telefono,
      email: client.email,
      direccion: client.direccion,
    });
    setIsModalOpen(true);
  };

  // Manejar inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar (Crear / Actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingClient) {
      // Lógica de Edición (UPDATE)
      setClientes((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...formData } : c))
      );
      console.log('Cliente actualizado:', { id: editingClient.id, ...formData });
      /* Petición HTTP a Java:
         await fetch(`http://localhost:8080/api/clientes/${editingClient.id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
      */
    } else {
      // Lógica de Creación (CREATE)
      const newClient = { id: Date.now(), ...formData };
      setClientes((prev) => [...prev, newClient]);
      console.log('Nuevo cliente creado:', newClient);
      /* Petición HTTP a Java:
         await fetch('http://localhost:8080/api/clientes', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
      */
    }

    setIsModalOpen(false);
  };

  // Eliminar cliente (DELETE)
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClientes((prev) => prev.filter((c) => c.id !== id));
      console.log('Cliente eliminado ID:', id);
      /* Petición HTTP a Java:
         await fetch(`http://localhost:8080/api/clientes/${id}`, { method: 'DELETE' });
      */
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO CON BORDE AMARILLO Y BOTÓN CREAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="border-l-4 border-amber-400 pl-3">
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1>
            <p className="text-sm text-slate-500">Administra los registros e información de facturación</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* TABLA DE CLIENTES (READ) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-yellow-200 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">NIT</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Correo</th>
                  <th className="px-6 py-4">Dirección</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{client.nombre}</td>
                    <td className="px-6 py-4 font-mono text-xs">{client.nit}</td>
                    <td className="px-6 py-4">{client.telefono}</td>
                    <td className="px-6 py-4">{client.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-6 py-4">
                        {client.direccion }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(client)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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

        {/* MODAL / FORMULARIO (CREATE & UPDATE) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                {editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Distribuidora El Pincel"
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
                      placeholder="Ej. 1234567-8 o CF"
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
                      placeholder="Ej. 5555-0000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="cliente@correo.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Av. Principal 123"
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
                    {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
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