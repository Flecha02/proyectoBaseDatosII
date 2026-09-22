'use client';

import { useState } from 'react';
import { useAuth } from '@/context/InicioSesion';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Aquí defines el correo y la contraseña de prueba
  if (formData.email === 'admin@pintapro.com' && formData.password === 'admin123') {
    login({
      nombre: 'Administrador',
      email: formData.  email,
      role: 'admin',
    });
  } else {
    alert('Credenciales incorrectas');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-600/80 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
        
        {/* LOGO Y ENCABEZADO */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 text-yellow-700 rounded-full flex items-center justify-center font-semibold text-xs border-2 border-blue-300 overflow-hidden">
            <img 
              src="/PintaPro.png" 
              alt="Logo Empresa" 
              className="w-20 h-20 object-contain" 
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Pinturas & Color
          </h1>
          <p className="text-xs uppercase tracking-wider text-yellow-600 font-semibold mt-1">
            Solventes • Barnices • Accesorios
          </p>
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="mb-4 p-3 text-xs text-red-700 bg-red-100 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo / Usuario
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="usuario@PintaPro.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all text-sm"
          >
            {loading ? 'Verificando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Proyecto Final - Desarrollo Web
        </p>
      </div>
    </div>
  );
}