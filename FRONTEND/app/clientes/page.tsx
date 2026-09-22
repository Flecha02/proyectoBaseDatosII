'use client';

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';

interface Cliente {
  idCliente: number;
  nitCliente: string;
  nombreCliente: string;
  telefonoCliente: string;
  direccionCliente: string;
  correoCliente?: string;
}

export default function GestionClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombreCliente: '',
    nitCliente: '',
    telefonoCliente: '',
    direccionCliente: '',
  });

  // Cargar clientes desde la API
  const cargarClientes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Cliente[]>('/clientes');
      setClientes(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar la lista de clientes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Abrir modal para Crear
  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setFormData({
      nombreCliente: '',
      nitCliente: '',
      telefonoCliente: '',
      direccionCliente: '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para Editar
  const handleOpenEditModal = (client: Cliente) => {
    setEditingClient(client);
    setFormData({
      nombreCliente: client.nombreCliente || '',
      nitCliente: client.nitCliente || '',
      telefonoCliente: client.telefonoCliente || '',
      direccionCliente: client.direccionCliente || '',
    });
    setIsModalOpen(true);
  };

  // Manejar inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar (Crear / Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingClient) {
        // Actualizar Cliente (PUT)
        await api.put(`/clientes/${editingClient.idCliente}`, formData);
      } else {
        // Crear Cliente (POST)
        await api.post('/clientes', formData);
      }
      setIsModalOpen(false);
      await cargarClientes();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Ocurrió un error al guardar el cliente');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar cliente (DELETE)
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes((prev) => prev.filter((c) => c.idCliente !== id));
      } catch (err) {
        if (err instanceof ApiError) {
          alert(err.message);
        } else {
          alert('Error al eliminar el cliente');
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

        {/* MENSAJE DE ERROR SI LO HAY */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={cargarClientes}
              className="underline text-xs font-semibold ml-4 hover:text-red-900"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* TABLA DE CLIENTES (READ) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-yellow-200 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
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
                      Cargando clientes desde la base de datos...
                    </td>
                  </tr>
                ) : clientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No hay clientes registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  clientes.map((client) => (
                    <tr key={client.idCliente} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{client.nombreCliente}</td>
                      <td className="px-6 py-4 font-mono text-xs">{client.nitCliente}</td>
                      <td className="px-6 py-4">{client.telefonoCliente || '-'}</td>
                      <td className="px-6 py-4">{client.direccionCliente || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(client)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(client.idCliente)}
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
                    name="nombreCliente"
                    value={formData.nombreCliente}
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
                      name="nitCliente"
                      value={formData.nitCliente}
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
                      name="telefonoCliente"
                      value={formData.telefonoCliente}
                      onChange={handleChange}
                      placeholder="Ej. 5555-0000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccionCliente"
                    value={formData.direccionCliente}
                    onChange={handleChange}
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
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-medium transition-colors"
                  >
                    {submitting ? 'Guardando...' : editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
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