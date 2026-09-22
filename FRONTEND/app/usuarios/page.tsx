'use client';

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';

interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  correoUsuario: string;
  estadoUsuario: boolean | number;
  idRol: number;
  nombreRol?: string;
}

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correoUsuario: '',
    contraseniaUsuario: '',
    idRol: 1,
  });

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Usuario[]>('/usuarios');
      setUsuarios(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar la lista de usuarios');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      nombreUsuario: '',
      correoUsuario: '',
      contraseniaUsuario: '',
      idRol: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      nombreUsuario: user.nombreUsuario || '',
      correoUsuario: user.correoUsuario || '',
      contraseniaUsuario: '',
      idRol: user.idRol || 1,
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
      if (editingUser) {
        // Actualizar usuario existente (PUT)
        await api.put(`/usuarios/${editingUser.idUsuario}`, {
          idRol: Number(formData.idRol),
          nombreUsuario: formData.nombreUsuario,
          correoUsuario: formData.correoUsuario,
        });
      } else {
        // Crear nuevo usuario (POST)
        if (!formData.contraseniaUsuario) {
          alert('La contraseña es obligatoria para nuevos usuarios');
          setSubmitting(false);
          return;
        }
        await api.post('/usuarios', {
          idRol: Number(formData.idRol),
          nombreUsuario: formData.nombreUsuario,
          correoUsuario: formData.correoUsuario,
          contraseniaUsuario: formData.contraseniaUsuario,
        });
      }

      setIsModalOpen(false);
      await cargarUsuarios();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Error al guardar el usuario');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Cambiar estado Activo / Inactivo mediante PATCH
  const handleToggleEstado = async (id: number) => {
    try {
      const res = await api.patch<{ mensaje: string; estadoUsuario: boolean }>(`/usuarios/${id}/estado`);
      setUsuarios((prev) =>
        prev.map((u) => (u.idUsuario === id ? { ...u, estadoUsuario: res.estadoUsuario } : u))
      );
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Error al cambiar el estado del usuario');
      }
    }
  };

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        setUsuarios((prev) => prev.filter((u) => u.idUsuario !== id));
      } catch (err) {
        if (err instanceof ApiError) {
          alert(err.message);
        } else {
          alert('Error al eliminar el usuario');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO Y BOTÓN CREAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="border-l-4 border-amber-400 pl-3">
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
            <p className="text-sm text-slate-500">Administra los accesos y roles del sistema</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            + Nuevo Usuario
          </button>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={cargarUsuarios}
              className="underline text-xs font-semibold ml-4 hover:text-red-900"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* TABLA DE USUARIOS (READ) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-blue-200 text-slate-700 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Correo</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      Cargando usuarios desde la base de datos...
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No hay usuarios registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((user) => {
                    const isActivo = Boolean(user.estadoUsuario);
                    return (
                      <tr key={user.idUsuario} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{user.nombreUsuario}</td>
                        <td className="px-6 py-4">{user.correoUsuario}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                            {user.nombreRol || `Rol #${user.idRol}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleEstado(user.idUsuario)}
                            title="Haz clic para alternar estado"
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isActivo
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {isActivo ? 'Activo' : 'Inactivo'} ⟳
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.idUsuario)}
                            className="text-rose-600 hover:text-rose-800 font-medium text-xs px-2 py-1 rounded hover:bg-rose-50"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre de Usuario</label>
                  <input
                    type="text"
                    name="nombreUsuario"
                    placeholder="Ej: Juan Pérez"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correoUsuario"
                    placeholder="Ej: usuario@PintaPro.com"
                    value={formData.correoUsuario}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      name="contraseniaUsuario"
                      placeholder="••••••••"
                      value={formData.contraseniaUsuario}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Rol</label>
                  <select
                    name="idRol"
                    value={formData.idRol}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm bg-white"
                  >
                    <option value={1}>Administrador</option>
                    <option value={2}>Digitador</option>
                    <option value={3}>Cajero</option>
                  </select>
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
                    {submitting ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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