'use client';

import { useState } from 'react';

// Datos iniciales de prueba (Mock Data) mientras tus compañeros listan los endpoints
const INITIAL_USERS = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@empresa.com', rol: 'Cajero', estado: 'Activo' },
  { id: 2, nombre: 'María López', email: 'maria@empresa.com', rol: 'Administrador', estado: 'Activo' },
  { id: 3, nombre: 'Carlos Gómez', email: 'carlos@empresa.com', rol: 'Digitador', estado: 'Inactivo' },
];

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = Crear, objeto = Editar

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Cajero',
    estado: 'Activo',
  });

  // Abrir modal para Crear
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'Cajero ', estado: 'Activo' });
    setIsModalOpen(true);
  };

  // Abrir modal para Editar
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '', // Se deja vacío a menos que se quiera actualizar
      rol: user.rol,
      estado: user.estado,
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

    if (editingUser) {
      // Lógica de Edición (UPDATE)
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      console.log('Usuario actualizado:', { id: editingUser.id, ...formData });
      /* Petición HTTP a Java:
         await fetch(`http://localhost:8080/api/usuarios/${editingUser.id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
      */
    } else {
      // Lógica de Creación (CREATE)
      const newUser = { id: Date.now(), ...formData };
      setUsuarios((prev) => [...prev, newUser]);
      console.log('Nuevo usuario creado:', newUser);
      /* Petición HTTP a Java:
         await fetch('http://localhost:8080/api/usuarios', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
      */
    }

    setIsModalOpen(false);
  };

  // Eliminar usuario (DELETE)
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      console.log('Usuario eliminado ID:', id);
      /* Petición HTTP a Java:
         await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: 'DELETE' });
      */
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
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{user.nombre}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          user.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {user.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Usuario</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Juan Pérez"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ej: usuario@PintaPro.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contraseña {editingUser && '(dejar en blanco si no se desea cambiar)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Rol</label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm bg-white"
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Digitador">Digitador</option>
                      <option value="Cajero">Cajero</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm bg-white"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
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
                    className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-5S00 text-white text-sm font-medium transition-colors"
                  >
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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